"use client";
import styles from "./page.module.css";
import React, { useRef, useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axios";

const RESEND_COOLDOWN = 60;

function Otp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(sessionStorage.getItem("email"));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ── ADDED: paste handler ──
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = pasted.split("");
    setOtp(newOtp);
    inputsRef.current[newOtp.length - 1]?.focus();
  };

  // Verify OTP
  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setError("Please enter all 4 digits");
      setLoading(false);
      return;
    }

    try {
      const verifyRes = await axiosClient.post("/api/otp/verify-web", {
        email: userEmail,
        otp: otpString,
      });

      const verifyData = verifyRes.data;

      if (!verifyData.success) {
        setError(verifyData.message || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      const res = await signIn("otp", {
        user: JSON.stringify(verifyData.user),
        token: verifyData.token || verifyData.jwt,
        redirect: false,
      });

      if (res?.error) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (verifyData.token || verifyData.jwt) {
        const Cookies = (await import("js-cookie")).default;
        Cookies.set("payload-token", verifyData.token || verifyData.jwt, { expires: 7 });
      }

      const redirectParam = searchParams.get("redirect") || "/";

      if (verifyData.isNewUser) {
        router.push(
          `/auth/create-profile?redirect=${encodeURIComponent(redirectParam)}`,
        );
      } else {
        router.push(redirectParam);
      }

      router.refresh();
    } catch (e) {
      console.error("OTP verification error:", e);
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      setError(backendMsg || e.message || "Verification failed");
      setLoading(false);
    }
  }

  // Resend OTP
  async function resendOtp() {
    if (countdown > 0) return;

    setError("");
    setInfo("");
    setResending(true);

    try {
      const signupRes = await axiosClient.post("/api/otp/send-web", {
        email: userEmail,
      });
      const json = signupRes.data;
      if (signupRes.status !== 200 || !json.success) {
        setError(json.message || "Unable to resend OTP");
        setResending(false);
        return;
      }
      setInfo("OTP sent again. Please check your email.");
      setCountdown(RESEND_COOLDOWN);
      setOtp(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (e) {
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      setError(backendMsg || e.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className={styles.Main}>
      <div className={styles.card}>
        <div className={styles.UpperTop}>
          <div className={styles.headingBlock}>
            <h3>Verify Email</h3>
            <p>Enter 4 digit code sent to {userEmail || "your email"}</p>
          </div>

          {/* ── ADDED: error / info messages ── */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {info && <p className={styles.infoMessage}>{info}</p>}

          {/* ── ADDED: otp inputs with paste + timer row ── */}
          <div className={styles.inputBlock}>
            <div className={styles.otpWrapper}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`${styles.otpInput} ${digit ? styles.otpFilled : ""}`}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.lowerBottom}>
          <button
            className={styles.ctacontinue}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
          <div className={styles.LowerText}>
            <p className={styles.tnc}>Didn't receive it? Check spam</p>
            <span className={styles.timerRow}>
              {countdown > 0 ? (
                <p className={styles.timerText}>
                  Resend in <span>00:{String(countdown).padStart(2, "0")}</span>
                </p>
              ) : (
                <button
                  className={styles.resendBtn}
                  onClick={resendOtp}
                  disabled={resending}
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Otp />
    </Suspense>
  );
}
