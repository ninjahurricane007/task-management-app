import { useAuthStore } from "@/store/authStore";

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
};

export const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const redirectToLogin = (): void => {
  if (typeof window !== "undefined") {
    const logout = useAuthStore.getState().logout;
    logout();
    window.location.href = "/login";
  }
};