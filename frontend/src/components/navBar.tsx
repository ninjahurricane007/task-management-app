"use client";

import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { useAuthStore } from "@/store/authStore";
import { MaterialUISwitch } from "./ThemeToggleSwitch";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const { logout, isLogin, hasHydrated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<null | string>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const name = getUserName();
    setUserName(name);
  }, []);

  const getUserName = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName");
    }
    return null;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  if (!hasHydrated) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 12.5 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
                md: "1.5rem",
              },
            }}
          >
            Task Management App
          </Typography>
          <MaterialUISwitch
            checked={theme === "dark"}
            onChange={toggleTheme}
          ></MaterialUISwitch>
          {isLogin && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                id="basic-button"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                slotProps={{
                  list: {
                    "aria-labelledby": "basic-button",
                  },
                }}
                style={{ marginTop: 7 }}
              >
                <MenuItem onClick={handleMenuClose}>Hi {userName} !</MenuItem>
                <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
