"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signOut as nextAuthSignOut,
  signIn,
  useSession,
} from "next-auth/react";
import axiosClient from "@/lib/axios";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      // Re-hydrate the payload-token cookie from the NextAuth session.
      // This is critical: on page refresh or new tab, NextAuth restores its
      // own httpOnly session cookie automatically, but the js-cookie
      // "payload-token" is a separate client-side cookie that can be lost
      // (browser clear, expiry, incognito, new device). If the session has
      // the token but the cookie is gone, every API call gets 401/403.
      const sessionToken = session.user["paylaod-token"];
      if (sessionToken) {
        const existing = Cookies.get("payload-token");
        if (!existing) {
          Cookies.set("payload-token", sessionToken, { expires: 7, path: "/" });
        }
      }

      // normalize to same shape
      const name =
        session.user.name ||
        (session.user.email ? (session.user.email || "").split("@")[0] : null);
      setUser({
        id: session.user.id || null,
        name,
        email: session.user.email || null,
        profile_image: session.user.profile_image || null,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session, status]);

  async function login({ username, password }) {
    // Use NextAuth signIn
    const res = await signIn("credentials", {
      redirect: false,
      email: username,
      password,
    });

    if (res?.error) {
      throw new Error(res.error || "Login failed");
    }
    // Session update logic handled by useEffect
    return res;
  }

  async function signup({ email, password, first_name, last_name }) {
    const res = await axiosClient.post("/api/website/auth/user-auth/signup", {
      email,
    });
    const data = res.data;
    // auto-login
    try {
      await login({ username: email, password });
    } catch (e) {
      // ignore
    }
    return data;
  }

  async function logout() {
    // Clear the client-side payload token cookie FIRST so no stale token
    // is sent via Authorization header during the in-flight logout request
    try {
      Cookies.remove("payload-token", { path: "/" });
    } catch (e) { }

    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error("Local logout error:", e);
    }
    try {
      // also sign out of NextAuth if user used social sign-in
      await nextAuthSignOut({ redirect: false });
    } catch (e) { }
    // Cart system removed: clear any cart-related localStorage keys if present
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    } catch (e) { }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signup, reload: () => { } }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
