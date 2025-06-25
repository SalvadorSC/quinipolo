// components/SubscriptionPage.tsx
import React, { useEffect, useState } from "react";
import { Container, Box, Paper } from "@mui/material";
import styles from "./SubscriptionPage.module.scss"; // Create a corresponding SCSS file
import SubscriptionDetails from "../../Components/SubscriptionDetails/SubscriptionDetails";
import SubscriptionPurchase from "../../Components/SubscriptionPurchase/SubscriptionPurchase";
import { apiGet } from "../../utils/apiUtils";
import { UserDataType, useUser } from "../../Context/UserContext/UserContext";
import { useTranslation } from 'react-i18next';

const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUser();
  const { t } = useTranslation();

  const fetchSubscription = async () => {
    try {
      const response = await apiGet<any>(
        `/api/subscriptions/subscription-details/${user.userData.userId}`,
        {
          headers: {
            Accept: "application/json",
            // Optionally add other headers here
          },
          withCredentials: false, // Ensure cookies are sent only if necessary
        }
      );
      setSubscription(response);
      const data = await apiGet<UserDataType>(
        `/api/users/user/data/${user.userData.username}`
      );
      user.updateUser({
        role: data.role,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userData.userId]);

  return (
    <Container className={styles.subscriptionContainer}>
      <Paper elevation={3} className={styles.subscriptionPaper}>
        <h2>{t('subscribe')}</h2>
        {subscription !== null && (
          <Box mb={4}>
            <SubscriptionDetails
              loading={loading}
              subscription={subscription}
              onCancel={fetchSubscription} // Refresh subscription details after cancellation
            />
          </Box>
        )}
        {subscription &&
          (subscription.status !== "active" || subscription.canceled_at) && (
            <SubscriptionPurchase />
          )}
      </Paper>
    </Container>
  );
};

export default SubscriptionPage;
