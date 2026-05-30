"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import styles from "../page.module.css";

const validateEmail = (val) => {
  if (!val) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email";
  return "";
};

export default function ContactSection({
  email,
  setEmail,
  setEmailUserTyped,
  status,
  session,
  validationErrors,
  clearError,
  setValidationErrors,
  newsletterOptIn,
  setNewsletterOptIn,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!email || validateEmail(email)) {
      setIsSubscribed(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://surge-backend-seven.vercel.app";
        const res = await fetch(`${serverUrl}/api/newsletters/check-subscription?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        setIsSubscribed(!!data.subscribed);
      } catch {
        setIsSubscribed(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [email]);

  const redirectUrl = encodeURIComponent(
    `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
  );

  return (
    <div className={styles.Two}>
      <div className={styles.TwoOne}>
        <h3>Contact</h3>
        {status !== "authenticated" && (
          <Link href={`/auth?redirect=${redirectUrl}`}>
            <p>Sign In</p>
          </Link>
        )}
      </div>

      <div className={styles.TwoTwo}>
        <div>
          <input
            className={`${styles.Input} ${validationErrors.email ? styles.InputError : ""}`}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailUserTyped(true);
              clearError("email");
            }}
            onBlur={() => {
              const error = validateEmail(email);
              if (error)
                setValidationErrors((prev) => ({ ...prev, email: error }));
            }}
            readOnly={!!session?.user?.email}
          />
          {validationErrors.email && (
            <span className={styles.ErrorMessage}>
              {validationErrors.email}
            </span>
          )}
        </div>

        <label
          className={styles.CheckBox}
          style={isSubscribed ? { cursor: "default", pointerEvents: "none" } : undefined}
          title={isSubscribed ? "You are already subscribed" : undefined}
        >
          <input
            type="checkbox"
            checked={isSubscribed || newsletterOptIn}
            disabled={isSubscribed}
            onChange={() => !isSubscribed && setNewsletterOptIn?.(!newsletterOptIn)}
            style={isSubscribed ? { opacity: 0.8, filter: "grayscale(1)" } : undefined}
          />
          <p>Email me with news and offers.{isSubscribed ? " (Already subscribed)" : ""}</p>
        </label>
      </div>
    </div>
  );
}
