// components/SubscriptionPurchase.tsx
import { Box, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import SubscriptionCardContent from "../SubscriptionCardComponent/SubscriptionCardComponent";
import styles from "./SubscriptionPurchase.module.scss"; // Create a corresponding SCSS file
import { Button } from "antd";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('subscribeAndSupport')}
      </Typography>

      <Button
        style={{ margin: "10px auto" }}
        onClick={() => setIsYearly(!isYearly)}
      >
        {t('switchTo')} {!isYearly ? t('yearlyPlan') : t('monthlyPlan')}
      </Button>
      <Typography
        variant="body2"
        mb={2}
        sx={{ color: "green", fontWeight: 600 }}
      >
        {!isYearly
          ? t('twoMonthsFreeYearly')
          : t('chooseYourPlan')}
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
                planName={t('proPlanYearly')}
                planPrice={t('yearlyPrice')}
                plan={plans[1]}
                description={t('yearlyPlanDescription')}
              />
            ) : (
              <SubscriptionCardContent
                planName={t('proPlan')}
                planPrice={t('monthlyPrice')}
                plan={plans[0]}
                description={t('monthlyPlanDescription')}
              />
            )}
          </div>
        </Card>
      </Box>
    </>
  );
};

export default SubscriptionPurchase;
