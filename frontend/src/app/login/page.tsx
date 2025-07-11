"use client";

import UserAuthenticationForm from "@/components/userAuthenticationForm";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();
  const { isLogin, hasHydrated } = useAuthStore();

  useEffect(() => {
    console.log(hasHydrated, isLogin)
    if (hasHydrated && isLogin) {
      router.replace("/tasks"); // stay in the home page, if user clicks back button from home page unless user log out
    }
  }, [hasHydrated, isLogin, router]);

  if (!hasHydrated) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <UserAuthenticationForm
        endpoint="/auth/signin"
        redirect="/tasks"
        errorMsg="Invalid Credentials"
        formHeading="Login to your account"
        successMsg="Login successful, Redirecting to home page"
      ></UserAuthenticationForm>

      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
