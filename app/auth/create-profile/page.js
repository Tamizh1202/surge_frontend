"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "./logo.png";
import flag from "./2.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";
import { Suspense } from "react";

function CreateProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderRef = useRef(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    setEmail(session?.user?.email || "");
    if (session?.user?.phone && !phone) {
      const formatted = session.user.phone.toString().replace(/[^0-9]/g, "");
      setPhone(formatted);
    }
  }, [session]);

  async function submit(e) {
    e.preventDefault();
    setError("");

    const uaePhoneRegex = /^5[024568]\d{7}$/;
    if (!uaePhoneRegex.test(phone)) {
      setError("Please enter a valid UAE mobile number (9 digits starting with 5).");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.patch(`/api/users/${session?.user?.id}`, {
        firstName,
        lastName,
        gender: gender.toLowerCase(),
        phone,
      });

      const json = await res.data;

      if (res.status !== 200) {
        throw new Error(json.message || "Profile update failed");
      }

      const redirectParam = searchParams.get("redirect") || "/";
      router.push(redirectParam);
      router.refresh();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.Main}>
      <div className={styles.card}>
        <div className={styles.UpperTop}>
          <div className={styles.headingBlock}>
            <h3>Create your Account</h3>
            <p>Your specialty coffee journey begins here.</p>
          </div>

          <div className={styles.inputBlock}>
            {error && <p className={styles.errorMessage}>{error}</p>}

            <input
              type="email"
              placeholder="Username@gmail.com"
              className={styles.inputemail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              suppressHydrationWarning
            />

            <div className={styles.nameRow}>
              <input
                type="text"
                placeholder="First name*"
                className={styles.inputemail}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
                suppressHydrationWarning
              />
              <input
                type="text"
                placeholder="Last name*"
                className={styles.inputemail}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            {/* Phone */}
            <div className={styles.numberInput}>
              <div className={styles.flagCode}>
                <Image src={flag} width={24} height={16} alt="flag" />
                <span>+971</span>
              </div>
              <input
                type="number"
                placeholder="Phone Number*"
                className={styles.phoneField}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            {/* Gender Dropdown */}
            <div className={styles.genderWrapper} ref={genderRef}>
              <button
                type="button"
                className={styles.genderTrigger}
                onClick={() => setIsGenderOpen((prev) => !prev)}
              >
                <span className={gender ? styles.genderSelected : styles.genderPlaceholder}>
                  {gender ? genderOptions.find(o => o.value === gender)?.label : "Gender"}
                </span>
                <svg
                  className={`${styles.chevron} ${isGenderOpen ? styles.chevronOpen : ""}`}
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isGenderOpen && (
                <div className={styles.genderDropdown}>

                  {genderOptions.map((opt) => (
                    <label key={opt.value} className={styles.genderOption}>
                      <span>{opt.label}</span>
                      <input
                        type="radio"
                        name="gender"
                        value={opt.value}
                        checked={gender === opt.value}
                        onChange={() => {
                          setGender(opt.value);
                          setIsGenderOpen(false);
                        }}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.lowerBottom}>
          <button
            className={styles.ctacontinue}
            onClick={submit}
            disabled={loading || !email}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateProfile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateProfileContent />
    </Suspense>
  );
}