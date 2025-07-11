"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function Home() {
  const router = useRouter();
  const { isLogin, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && isLogin) {
      router.replace("/tasks");
    }
  }, [hasHydrated, isLogin, router]);

  if (!hasHydrated) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box textAlign="center" px={2}>
      <Typography variant="h4" gutterBottom mb={5}>
        Welcome to Task Management App using Next.js & NestJS
      </Typography>

      <Typography variant="h6" mb={2}>
        If you already have an account:
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push("/login")}
        sx={{ mb: 4 }}
      >
        Sign In
      </Button>

      <Typography variant="h6" mb={2}>
        New user?
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push("/signup")}
      >
        Sign Up
      </Button>
    </Box>
  );
}
