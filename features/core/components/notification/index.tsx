"use client";
import { Snackbar, Alert } from "@mui/material";
import { useNotificationStore } from "@/features/core/store";
export const Notification = () => {
  const { open, text, severity, close } = useNotificationStore();
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    close();
  };
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" role="alert">
        {text}
      </Alert>
    </Snackbar>
  );
};
