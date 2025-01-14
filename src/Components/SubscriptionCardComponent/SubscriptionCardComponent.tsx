// components/SubscriptionCardContent.tsx
import React from "react";
import { Button, CardContent, Typography } from "@mui/material";
import { useUser } from "../../Context/UserContext/UserContext";
import { Plan } from "../SubscriptionPurchase/SubscriptionPurchase";

interface SubscriptionCardContentProps {
  planName: string;
  planPrice: string;
  description: string;
  plan: Plan;
}

const SubscriptionCardContent: React.FC<SubscriptionCardContentProps> = ({
  planName,
  planPrice,
  description,
  plan,
}) => {
  const user = useUser();
  return (
    <CardContent
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 20,
      }}
    >
      <Typography variant="h5" textAlign={"left"} component="h2">
        <b>{planName}</b>
      </Typography>
      <Typography variant="body2" component="p" sx={{ textAlign: "left" }}>
        {description}
      </Typography>
      <Typography variant="body2" component="p">
        <b>{planPrice}</b>
      </Typography>
      <a
        href={plan.link + "?prefilled_email=" + user.userData.emailAddress}
        target="_blank"
        rel="noreferrer"
      >
        <Button variant="contained" color="primary">
          Continuar
        </Button>
      </a>
    </CardContent>
  );
};

export default SubscriptionCardContent;
