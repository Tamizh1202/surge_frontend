"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import styles from "../page.module.css";

// TODO: replace with Surge's actual email validator
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
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

        <label className={styles.CheckBox}>
          <input type="checkbox" />
          <p>Email me with news and offers.</p>
        </label>
      </div>
    </div>
  );
}