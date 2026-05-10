"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "./emotionCache";
import { Notification, SWRProviders } from "@/features/core";

const cache = createEmotionCache();
export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRProviders>{children}</SWRProviders>
        <Notification />
      </ThemeProvider>
    </CacheProvider>
  );
};
