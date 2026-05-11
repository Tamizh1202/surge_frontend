import axios from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Automatically attach the payload-token from cookies on every request
axiosClient.interceptors.request.use((config) => {
  const payloadToken = Cookies.get("payload-token");

  if (payloadToken) {
    config.headers["Authorization"] = `JWT ${payloadToken}`;
  }

  return config;
});

let isSigningOut = false;

// If an authenticated request gets a 401 (token invalid / user deleted),
// clear the session and redirect to auth so the user gets a clean login prompt.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const wasAuthenticated = !!error.config?.headers?.["Authorization"];

    if (status === 401 && wasAuthenticated && !isSigningOut) {
      isSigningOut = true;
      Cookies.remove("payload-token", { path: "/" });
      await signOut({ redirect: false });
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
