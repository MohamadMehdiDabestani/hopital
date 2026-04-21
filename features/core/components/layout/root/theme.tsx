import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",

  typography: {
    fontFamily: "Vazir, Arial, sans-serif",
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [
          {
            fontFamily: "Vazir",
            src: `
              url('/fonts/Vazir.eot');
              url('/fonts/Vazir.eot?#iefix') format('embedded-opentype'),
              url('/fonts/Vazir.woff2') format('woff2'),
              url('/fonts/Vazir.woff') format('woff')
            `,
            fontWeight: 400,
            fontStyle: "normal",
            fontDisplay: "swap",
          },
          {
            fontFamily: "Vazir",
            src: `
              url('/fonts/Vazir-Medium.woff2') format('woff2'),
              url('/fonts/Vazir-Medium.woff') format('woff')
            `,
            fontWeight: 500,
            fontStyle: "normal",
            fontDisplay: "swap",
          },
        ],

        body: {
          background: "#f5f5f5",
          margin: 0,
          padding: 0,
        },

        "*": {
          fontFamily: "Vazir, Arial, sans-serif",
        },
      },
    },
  },
});
