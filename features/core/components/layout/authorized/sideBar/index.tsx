"use client";

import { Fragment, useEffect } from "react";
import { Box, Drawer } from "@mui/material";

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
    console.log("changed", isDesktop);
  }, [isDesktop]);
  return (
    <Fragment>
      {isDesktop && (
        <Grid size={{ md: open ? 2 : 0.5, xs: 0 }}>
          <Drawer variant="persistent" anchor="left" open={true}>
            <DrawerContent />
          </Drawer>
        </Grid>
      )}

      {!isDesktop && (
        <Drawer
          variant="temporary"
          anchor="left"
          keepMounted={true}
          open={open}
          onClose={() => setOpen(false)}
        >
          <DrawerContent />
        </Drawer>
      )}
    </Fragment>
  );
};
