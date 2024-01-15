import React, { useState, useEffect } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface IFeedback {
  isOpen: boolean;
  onClose: () => void;
  severity: "success" | "info" | "warning" | "error";
  message: string;
  color: string;
}

const Feedback = ({ isOpen, onClose, severity, message, color }: IFeedback) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        style={{ backgroundColor: color }}
        message={<span>{message}</span>}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Feedback;
