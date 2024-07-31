// components/Subscribe.tsx
import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button, Box, CircularProgress } from "@mui/material";
import { apiPost } from "../../utils/apiUtils";
import { useUser } from "../../Context/UserContext/UserContext";

import styles from "./Subscribe.module.scss";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
interface SubscribeProps {
  planId: string;
  setCurrentPlan: React.Dispatch<React.SetStateAction<string | null>>;
}

const Subscribe: React.FC<SubscribeProps> = ({ planId, setCurrentPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      return;
    }
    setLoading(true);
    const response = await apiPost("/api/subscriptions/create-subscription", {
      userId: user.userData.userId,
      paymentMethodId: paymentMethod.id,
      planId: planId,
    });

    console.log("Subscription response:", response);
    setCurrentPlan(planId);
    setLoading(false);
    setFeedback({
      message: "Subscription created successfully",
      severity: "success",
      open: true,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={styles.subscribePaper}
      sx={{
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <CardElement />
      {loading ? (
        <CircularProgress sx={{ mt: 5 }} />
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!stripe || planId === ""}
          sx={{ mt: 4 }}
        >
          Subscribe
        </Button>
      )}
    </Box>
  );
};

export default Subscribe;
