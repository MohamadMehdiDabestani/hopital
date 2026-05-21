"use client";
import { ReactNode } from "react";
import { Box, Grid, Toolbar } from "@mui/material";
import { Sidebar } from "./sideBar";
import { useDrawerStore } from "@/features/core/store";

export function AuthorizedLayoutClient({ children }: { children: ReactNode }) {
  const { open } = useDrawerStore();

  return (
    <Grid
      container
      sx={{
        p: { xs: 2, md: 0 },
        px: { xl: open ? 3 : 2, lg: open ? 5 : 2, md: open ? 4 : 2 },
        mt: { xs: 0, md: 5 },
      }}
    >
      <Sidebar />
      <Grid
        size={{ xs: 12, lg: open ? 10 : 12, md: open ? 10 : 11 }}
        offset={{
          xl: open ? 1.8 : 0.5,
        lg: open ? 2.5 : 0.5,
        md: open ? 3 : 0.5,
        }}
      >
        <Toolbar />
        <Box sx={{ height: "100%" }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}
