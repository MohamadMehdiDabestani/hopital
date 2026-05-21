"use client";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useDrawerStore, useUserStore } from "@/features/core/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useCallback } from "react";
import UserMenu from "@/features/auth/components/userMenu";

export const AppBarHeader = () => {
  const { drawerWidth, setOpen } = useDrawerStore();
  const { user } = useUserStore();
  const handleClick = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
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
          onClick={handleClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <UserMenu />
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <Typography variant="h6" noWrap component="div">
            {user && user?.firstName + " " + user?.lastName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
