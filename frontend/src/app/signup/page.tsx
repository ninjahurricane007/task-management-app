"use client"

import UserAuthenticationForm from "@/components/userAuthenticationForm";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUp() {
  const router = useRouter();
  const { isLogin, hasHydrated } = useAuthStore();

  useEffect(() => {
    console.log("hyd", hasHydrated, "log", isLogin);
    if (hasHydrated && isLogin) {
      router.replace("/tasks"); // stay in the home page, if user clicks back button from home page unless user log out
    }
  }, [hasHydrated, isLogin, router]);

  if (!hasHydrated) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <CircularProgress />
    </div>
  );
}

  return (
    <div style={{textAlign: 'center'}}>
    <UserAuthenticationForm
      endpoint="/auth/signup"
      redirect="/login"
      errorMsg="Username Already Exists"
      formHeading="Create New Account"
      successMsg="Sign up successful, Redirecting to login page"
    ></UserAuthenticationForm>

    <p>
      Already have an account? <Link href="/login">Login here</Link>
    </p>
    </div>
  );
}
