"use client";

import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { AccountCircle, Lock, Logout } from "@mui/icons-material";
import { logoutUser } from "@/features/auth/actions";
import { ChangePasswordDialog } from "./changePasswordDialog";
import { useUserStore } from "@/features/core";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {clearUser , user} = useUserStore()
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleLogout = async () => {
    handleMenuClose();
    clearUser()
    await logoutUser();
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        onClick={handleMenuOpen}
      >
        <AccountCircle />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem disabled>
          <ListItemText primary={user ? user.firstName + user.lastName : ""} secondary={user?.role} />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <Lock fontSize="small" />
          </ListItemIcon>
          <ListItemText>تغییر رمز عبور</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>خروج از حساب</ListItemText>
        </MenuItem>
      </Menu>

      <ChangePasswordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
