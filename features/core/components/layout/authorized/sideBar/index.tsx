"use client";

import { useEffect } from "react";
import { Drawer } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DrawerContent } from "./drawerContent";
import { useDrawerStore } from "@/features/core";

export const Sidebar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { open, setOpen } = useDrawerStore();

  useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop, setOpen]);

  return (
    <>
      <Grid size={{ md: open ? 2 : 0.5, xs: 0 }} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={isDesktop}
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <DrawerContent />
        </Drawer>
      </Grid>

      <Drawer
        variant="temporary"
        anchor="left"
        open={open && !isDesktop}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <DrawerContent />
      </Drawer>
    </>
  );
};
