"use client";

import styles from '@/components/userAuthenticationForm.module.css'
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, TextField } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";

type FormProps = {
  endpoint: string;
  redirect: string;
  formHeading: string;
  successMsg: string;
  errorMsg: string;
};

export default function UserAuthenticationForm({
  endpoint,
  redirect,
  formHeading,
  successMsg,
}: FormProps) {
  const router = useRouter();
  const { login } = useAuthStore();

  type AuthFormInputs = {
    username: string;
    password: string;
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<AuthFormInputs>();

  const onSubmit = async (data: AuthFormInputs) => {
    try {
      const result = await api.post(endpoint, data);

      setShowError(false);
      setShowSuccess(true);
      if (result.data.accessToken && result.data.refreshToken) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        login();
      }
      console.log("result", result);

      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    } catch (error: unknown) {
      setShowError(true);
      if (error instanceof AxiosError) {
        const data = error.response?.data;

        if (data?.message) {
          const message = Array.isArray(data.message)
            ? data.message.join(", ") // join all validation messages
            : data.message;

          setErrorMsg(message);
        } else {
          setErrorMsg("Something went wrong");
        }
      } else {
        setErrorMsg("Unexpected error occurred");
      }
      console.error("error", error);
    }
  };

  return (
    <div>
      <h2>{formHeading}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <br></br>
        <TextField
          {...register("username", { required: "Username is required" })}
          type="text"
          placeholder="Enter Email"
        ></TextField>
        <br></br>
        <br></br>
        <label>Password</label>
        <br></br>
        <TextField
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Enter Password"
        ></TextField>
        <br></br>
        <br></br>
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <br></br>
        <br></br>
        <div className={styles.alertMsg}>
          {showSuccess && <Alert severity="success">{successMsg}</Alert>}
          {showError && <Alert severity="error">{errorMsg}</Alert>}
        </div>
      </form>
    </div>
  );
}
