// components/SubscriptionPurchase.tsx
import { Box, Card, FormControlLabel, Switch, Typography } from "@mui/material";
import React, { useState } from "react";
import SubscriptionCardContent from "../SubscriptionCardComponent/SubscriptionCardComponent";
import styles from "./SubscriptionPurchase.module.scss"; // Create a corresponding SCSS file
import Subscribe from "../Subscribe/Subscribe";

interface SubscriptionPurchaseProps {
  onSubscriptionCreated: () => void; // Callback to refresh subscription details after creating a new subscription
}

const SubscriptionPurchase: React.FC<SubscriptionPurchaseProps> = ({
  onSubscriptionCreated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan("");
    setIsYearly(event.target.checked);
  };

  const handleSubscriptionCreated = () => {
    onSubscriptionCreated();
  };

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        Suscríbete y apoya el desarrollo de Quinipolo
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        sx={{ display: "flex", justifyContent: "center" }}
        mb={4}
      >
        <FormControlLabel
          control={<Switch checked={isYearly} onChange={handleToggle} />}
          label={isYearly ? "Plan Anual" : "Plan Mensual"}
        />
        <Typography variant="body2" ml={2} sx={{ color: "green" }}>
          {!isYearly
            ? `Obtén 2 meses gratis con el plan anual!`
            : `Elige el plan que prefieras`}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-around"
        className={styles.subscriptionTypesWrapper}
        mb={4}
      >
        <Card className={styles.subscriptionCard}>
          <div className={styles.subscriptionCardTypesWrapper}>
            {isYearly ? (
              <SubscriptionCardContent
                selectedPlan={selectedPlan}
                planName="Plan PRO (Anual)"
                planPrice="30€/año"
                planId={process.env.REACT_APP_PRO_YEARLY_PLAN_ID as string}
                description="Este plan ayuda al desarrollador y te permitirá unirte a todas
              las ligas que quieras."
                onSelect={handlePlanSelect}
              />
            ) : (
              <SubscriptionCardContent
                selectedPlan={selectedPlan}
                planName="Plan PRO"
                planPrice="3€/mes"
                planId={process.env.REACT_APP_PRO_MONTHLY_PLAN_ID as string}
                description="Este plan ayuda al desarrollador y te permitirá unirte a todas
              las ligas que quieras. En un futuro te permitirá ver tus propias estadísticas por liga."
                onSelect={handlePlanSelect}
              />
            )}
          </div>
        </Card>
        <Card className={styles.subscriptionCard}>
          <div className={styles.subscriptionCardTypesWrapper}>
            {isYearly ? (
              <SubscriptionCardContent
                selectedPlan={selectedPlan}
                planName="Plan Moderador (Anual)"
                planPrice="40€/año"
                planId={
                  process.env.REACT_APP_MODERATOR_YEARLY_PLAN_ID as string
                }
                onSelect={handlePlanSelect}
                description="Este plan incluye todas las funcionalidades del plan PRO, pero
              además te permite crear tus propias ligas y torneos."
              />
            ) : (
              <SubscriptionCardContent
                selectedPlan={selectedPlan}
                planName="Plan Moderador"
                planPrice="4€/mes"
                planId={
                  process.env.REACT_APP_MODERATOR_MONTHLY_PLAN_ID as string
                }
                onSelect={handlePlanSelect}
                description="Este plan incluye todas las funcionalidades del plan PRO, pero
              además te permite crear tus propias ligas y torneos."
              />
            )}
          </div>
        </Card>
      </Box>
      {/* if (!planId) {
    return (
      <Typography variant="h6">Seleccione un plan para suscribirse</Typography>
    );
  } */}
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          maxWidth: 300,
          transition: "height 0.5s",
        }}
        mt={4}
      >
        {!selectedPlan ? (
          <Typography variant="h6"></Typography>
        ) : (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Introduzca sus datos de pago:
            </Typography>
            <Subscribe
              planId={selectedPlan}
              setCurrentPlan={handleSubscriptionCreated}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default SubscriptionPurchase;
