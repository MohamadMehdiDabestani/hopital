"use client";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useDrawerStore } from "@/features/core/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useCallback } from "react";
import { logoutUser } from "@/features/auth";
import UserMenu from "@/features/auth/components/userMenu";

interface AppBarHeaderProps {
  userName: string;
  role: string;
}

export const AppBarHeader = ({ userName ,role}: AppBarHeaderProps) => {
  const { drawerWidth, setOpen } = useDrawerStore();

  const handleClick = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleLogout = useCallback(async () => {
    await logoutUser();
  }, []);
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
        <UserMenu userName={userName} role={role} />
        <Box sx={{ flexGrow: 1 , ml : 1 }}>
          <Typography variant="h6" noWrap component="div">
            {userName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
