"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "./emotionCache";
import { Notification, SWRProviders } from "@/features/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const cache = createEmotionCache();
export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa">
          <SWRProviders>{children}</SWRProviders>
        </LocalizationProvider>
        <Notification />
      </ThemeProvider>
    </CacheProvider>
  );
};
