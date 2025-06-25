import React, { useState, useEffect } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

interface IFeedback {
  isOpen: boolean;
  onClose: () => void;
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const Feedback = ({ isOpen, onClose, message, severity }: IFeedback) => {
  const { t } = useTranslation();
  let color;

  switch (severity) {
    case "success":
      color = "#7cb305";
      break;
    case "info":
      color = "#1890ff";
      break;
    case "warning":
      color = "#faad14";
      break;
    case "error":
      color = "#a8071a";
      break;
    default:
      color = "#1890ff";
      break;
  }

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
        message={<span>{t(message)}</span>}
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
