// components/SubscriptionDetails.tsx
import React, { useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { apiPost } from "../../utils/apiUtils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [canceling, setCanceling] = useState<boolean>(false);
  let planName = t("unknownPlan");
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
    planName = planData[productId] || t("unknownPlan");
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
        {t("subscriptionDetails")}
      </Typography>
      {subscription.message !== "No active subscriptions found" ? (
        <Box>
          <Typography variant="body1">
            <strong>{t("subscriptionType")}:</strong> {planName}
          </Typography>
          <Typography variant="body1">
            <strong>{t("price")}:</strong>{" "}
            {subscription.items.data[0].price.unit_amount / 100}{" "}
            {subscription.items.data[0].price.currency.toUpperCase()} {t("per")}{" "}
            {subscription.items.data[0].price.recurring.interval}
          </Typography>
          <Typography variant="body1">
            <strong>{t("subscriptionStatus")}:</strong>{" "}
            {subscription.canceled_at ? t("cancelled") : subscription.status}
          </Typography>
          <Typography variant="body1">
            <strong>{t("subscriptionEnd")}:</strong>{" "}
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
              <Typography variant="body1">
                {t("changePlanCancelFirst")}
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={handleCancelSubscription}
                disabled={canceling}
                sx={{ marginTop: "16px", marginRight: "8px" }}
              >
                {canceling ? t("cancelling") : t("subscriptionCancel")}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body1">{t("noActiveSubscriptions")}</Typography>
      )}
    </Box>
  );
};

export default SubscriptionDetails;
