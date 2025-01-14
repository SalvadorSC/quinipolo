// components/SubscriptionPurchase.tsx
import { Box, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import SubscriptionCardContent from "../SubscriptionCardComponent/SubscriptionCardComponent";
import styles from "./SubscriptionPurchase.module.scss"; // Create a corresponding SCSS file
import { Button } from "antd";

const plans = [
  // Quinipolo Pro Plan Mensual
  {
    link:
      process.env.REACT_APP_ENV === "development"
        ? (process.env.REACT_APP_PRO_MONTHLY_LINK as string)
        : /* "https://buy.stripe.com/9AQ29marg0c7crC145" */ "",
    priceId:
      process.env.REACT_APP_ENV === "development"
        ? (process.env.REACT_APP_PRO_MONTHLY_PLAN_ID as string)
        : /* "price_1PiZHTBAGHnqysPyttUn5FzX" */ "",
  },
  // Quinipolo Pro Plan Anual
  {
    link:
      process.env.REACT_APP_ENV === "development"
        ? (process.env.REACT_APP_PRO_YEARLY_LINK as string)
        : /* "https://buy.stripe.com/6oE01egPE0c763e146" */ "",
    priceId:
      process.env.REACT_APP_ENV === "development"
        ? (process.env.REACT_APP_PRO_YEARLY_PLAN_ID as string)
        : /* "price_1PiZHTBAGHnqysPydKOPLAtC" */ "",
  },
];

export type Plan = {
  link: string;
  priceId: string;
};

const SubscriptionPurchase: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        ¡Suscríbete y apoya el desarrollo de Quinipolo!
      </Typography>

      <Button
        style={{ margin: "10px auto" }}
        onClick={() => setIsYearly(!isYearly)}
      >
        Cambiar a {!isYearly ? "Plan Anual" : "Plan Mensual"}
      </Button>
      <Typography
        variant="body2"
        mb={2}
        sx={{ color: "green", fontWeight: 600 }}
      >
        {!isYearly
          ? `Obtén 2 meses gratis con el plan anual!`
          : `Elige el plan que prefieras.`}
      </Typography>
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
                planName="Plan PRO (Anual)"
                planPrice="30€/año"
                plan={plans[1]}
                description="Este plan ayuda al desarrollador y te permitirá unirte a todas
              las ligas que quieras. En un futuro te permitirá ver tus propias estadísticas por liga. Además, obtén 2 meses gratis!"
              />
            ) : (
              <SubscriptionCardContent
                planName="Plan PRO"
                planPrice="3€/mes"
                plan={plans[0]}
                description="Este plan ayuda al desarrollador y te permitirá unirte a todas
              las ligas que quieras. En un futuro te permitirá ver tus propias estadísticas por liga."
              />
            )}
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SubscriptionPurchase;
