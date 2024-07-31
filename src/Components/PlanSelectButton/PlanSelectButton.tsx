// components/PlanSelectButton.tsx
import React from "react";
import { Button, CardActions } from "@mui/material";

interface PlanSelectButtonProps {
  planId: string;
  selectedPlan: string;
  onSelect: (planId: string) => void;
}

const PlanSelectButton: React.FC<PlanSelectButtonProps> = ({
  planId,
  selectedPlan,
  onSelect,
}) => {
  if (selectedPlan === planId) {
    return (
      <CardActions sx={{ p: 0 }}>
        <Button variant="contained" color="primary" disabled>
          Selected
        </Button>
      </CardActions>
    );
  } else {
    return (
      <CardActions sx={{ p: 0 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSelect(planId)}
        >
          Seleccionar
        </Button>
      </CardActions>
    );
  }
};

export default PlanSelectButton;
