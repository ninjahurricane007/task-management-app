// app/lib/api.ts
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
  redirectToLogin,
} from "./token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const res = await axios.post("http://localhost:3000/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        clearTokens();
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
