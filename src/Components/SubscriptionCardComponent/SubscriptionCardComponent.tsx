// components/SubscriptionCardContent.tsx
import React from "react";
import { CardContent, Typography } from "@mui/material";
import PlanSelectButton from "../PlanSelectButton/PlanSelectButton";

interface SubscriptionCardContentProps {
  planName: string;
  planPrice: string;
  planId: string;
  onSelect: (planId: string) => void;
  description: string;
  selectedPlan: string;
}

const SubscriptionCardContent: React.FC<SubscriptionCardContentProps> = ({
  planName,
  planPrice,
  planId,
  onSelect,
  description,
  selectedPlan,
}) => (
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
      {planName}
    </Typography>
    <Typography variant="body2" component="p" sx={{ textAlign: "left" }}>
      {description}
    </Typography>
    <Typography variant="body2" component="p">
      {planPrice}
    </Typography>
    <PlanSelectButton
      planId={planId}
      selectedPlan={selectedPlan}
      onSelect={onSelect}
    />
  </CardContent>
);

export default SubscriptionCardContent;
