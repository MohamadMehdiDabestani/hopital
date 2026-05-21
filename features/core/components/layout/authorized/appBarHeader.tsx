"use client";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useDrawerStore } from "@/features/core/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useCallback } from "react";
import { logoutUser } from "@/features/auth";

interface AppBarHeaderProps {
  userName: string;
}

export const AppBarHeader = ({ userName }: AppBarHeaderProps) => {
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div">
            {userName}
            <Typography
              component="span"
              sx={{ display: "inline-block", ml: 1, cursor: "pointer" }}
              onClick={handleLogout}
            >
              (برای خروج کلیک کنید)
            </Typography>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
