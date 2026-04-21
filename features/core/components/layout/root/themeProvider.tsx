"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "./emotionCache";

const cache = createEmotionCache();
export const MuiThemeProvider = ({ children }: {children: ReactNode}) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
