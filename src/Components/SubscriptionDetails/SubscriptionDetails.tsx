// components/SubscriptionDetails.tsx
import React, { useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { apiPost } from "../../utils/apiUtils";

interface SubscriptionDetailsProps {
  loading: boolean;
  subscription: any;
  onCancel: () => void; // Callback to refresh the subscription status after cancellation
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  loading,
  subscription,
  onCancel,
}) => {
  const [canceling, setCanceling] = useState<boolean>(false);
  let planName = "Unknown Plan";
  interface PlanData {
    [key: string]: string;
  }
  const planData: PlanData = {
    prod_QXo2ysNiKtDOor: "Plan PRO",
    prod_QXo2x0lInGxrEe: "Plan Moderador",
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      await apiPost(`/api/subscriptions/cancel-subscription`, {
        subscriptionId: subscription.id,
      });
      onCancel();
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (subscription.message !== "No active subscriptions found") {
    const productId = subscription.items.data[0].price.product;
    planName = planData[productId] || "Unknown Plan";
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(173, 216, 230, 0.3)", // Light blue background
        padding: "16px",
        borderRadius: "8px",
        textAlign: "left",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Detalles de la suscripción
      </Typography>
      {subscription.message !== "No active subscriptions found" ? (
        <Box>
          <Typography variant="body1">
            <strong>Plan:</strong> {planName}
          </Typography>
          <Typography variant="body1">
            <strong>Precio:</strong>{" "}
            {subscription.items.data[0].price.unit_amount / 100}{" "}
            {subscription.items.data[0].price.currency.toUpperCase()} por{" "}
            {subscription.items.data[0].price.recurring.interval}
          </Typography>
          <Typography variant="body1">
            <strong>Estado:</strong>{" "}
            {subscription.canceled_at ? "Cancelado" : subscription.status}
          </Typography>
          <Typography variant="body1">
            <strong>Fin del período actual:</strong>{" "}
            {new Date(
              subscription.current_period_end * 1000
            ).toLocaleDateString()}
          </Typography>
          {!subscription.canceled_at && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Add copy to explain that if you want to change plans, you first need to cancel the one you have. */}
              <Typography variant="body1">
                Para modificar el plan actual hay que cancelar la suscripción
                primero.
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={handleCancelSubscription}
                disabled={canceling}
                sx={{ marginTop: "16px", marginRight: "8px" }}
              >
                {canceling ? "Cancelando..." : "Cancelar suscripción"}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body1">No hay suscripciones activas</Typography>
      )}
    </Box>
  );
};

export default SubscriptionDetails;
