"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "./emotionCache";
import { Notification, SWRProviders } from "@/features/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // تغییر به AdapterDayjs

import { faIR } from "@mui/x-date-pickers/locales";
import dayjs from "@/features/core/utils/dayjs"; // مسیر فایل کانفیگ dayjs شما
import 'dayjs/locale/fa'; 

const cache = createEmotionCache();
export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          dateLibInstance={dayjs} // خیلی مهم! اینطوری تنظیمات timezone شما اعمال میشه
          localeText={
            faIR.components.MuiLocalizationProvider.defaultProps.localeText
          }
          adapterLocale="fa"
        >
          <SWRProviders>{children}</SWRProviders>
        </LocalizationProvider>
        <Notification />
      </ThemeProvider>
    </CacheProvider>
  );
};
