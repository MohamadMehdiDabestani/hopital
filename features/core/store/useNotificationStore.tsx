import { create } from "zustand";
import { AlertColor } from "@mui/material";
type NotificationState = {
  open: boolean;
  text: string;
  severity: AlertColor;
  show: (text: string, severity: AlertColor) => void;
  close: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  text: "",
  severity: "success",
  close: () => set({ open: false }),
  show: (text, severity) => set({ open: true, text, severity }),
}));
