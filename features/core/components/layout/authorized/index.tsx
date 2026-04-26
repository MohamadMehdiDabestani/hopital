"use client";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Sidebar } from "./sideBar";
import { useDrawerStore } from "@/features/core/store";
import MenuIcon from "@mui/icons-material/Menu";

export const AuthorizedLayout = ({ children }: { children: ReactNode }) => {
  const { drawerWidth, open, setOpen } = useDrawerStore();
  return (
    <Grid container sx={{p:{xs : 2 , md : 0} , mt:{xs : 0 , md:5}}}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setOpen(true)} // this button just will open drawer in phone
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            عنوان برنامه
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Grid
        size={{ xs: 12, lg: open ? 10 : 12, md: open ? 10 : 11 }}
        offset={{
          xl: open ? 1.7 : 0.5,
          lg: open ? 2.2 : 0.5,
          md: open ? 3 : 0.5,
        }}
      >
        <Toolbar />

        <Box
          sx={{
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};
