import { Button, Input, Paper, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";

const ProductDisplay = () => (
  <Paper>
    <Stack>
      <h3>Starter plan</h3>
      <h5>$20.00 / month</h5>
    </Stack>
    <form action="/create-checkout-session" method="POST">
      {/* Add a hidden field with the lookup_key of your Price */}
      <Input type="hidden" name="lookup_key" value="{{PRICE_LOOKUP_KEY}}" />
      <Button id="checkout-and-portal-button" type="submit">
        Checkout
      </Button>
    </form>
  </Paper>
);

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
  return (
    <section>
      <h3>Subscription to starter plan successful!</h3>
      <form action="/create-portal-session" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
  </section>
);

const ProPlanPayment = () => {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id")!);
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
};

export default ProPlanPayment;
