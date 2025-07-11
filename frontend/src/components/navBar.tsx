"use client";

import { useRouter } from "next/navigation";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { MaterialUISwitch } from "./ThemeToggleSwitch";
import { useThemeStore } from "@/store/themeStore";

export default function NavBar() {
  const router = useRouter();
  const { logout, isLogin, hasHydrated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

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
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
