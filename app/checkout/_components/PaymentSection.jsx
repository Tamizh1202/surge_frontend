"use client";
import { useState, useEffect } from "react";
import styles from "../page.module.css";

import { PaymentElement } from "@stripe/react-stripe-js";

// TODO: replace ALL White Mantis branding/contact info with Surge equivalents
const POLICIES = {
  // ⬇️ PASTE THE ORIGINAL `POLICIES` OBJECT CONTENT FROM WHITE MANTIS HERE,
  // exactly as-is. Then do a find-and-replace:
  //   "White Mantis Roastery" → "Surge"
  //   "WHITE MANTIS ROASTERY LLC" → "SURGE LLC" (or your legal name)
  //   "support@whitemantis.ae" → your support email
  //   "hello@whitemantis.ae" → your contact email
  //   "0589535337" / "+971 - 05 8953 5337" → your phone
  //   Dubai address → your address
};

function PolicyModal({ policy, onClose }) {
  if (!policy) return null;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 999 }}
      />
      <div
        data-lenis-prevent
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#faf9f6", padding: "32px", width: "min(520px, 90vw)",
          maxHeight: "75vh", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{
            margin: 0, fontFamily: "var(--Lexend)", fontSize: "24px",
            fontWeight: 700, letterSpacing: "-0.02em", color: "#1a1a1a",
          }}>
            {policy.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: "1.25rem",
              cursor: "pointer", lineHeight: 1, color: "#555", padding: "4px 8px",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div style={{
          fontFamily: "var(--Lexend)", fontSize: "15px", fontWeight: 400,
          lineHeight: "1.8", color: "#444", letterSpacing: "-0.01em",
        }}>
          {policy.content}
        </div>
      </div>
    </>
  );
}

export function PaymentCardSection({ validationErrors }) {
  return (
    <div className={styles.Five}>
      <h3>Payment</h3>
      <p>All transactions are secure and encrypted.</p>
      <div className={styles.PaymentContainer}>
        <div className={styles.PaymentBody}>
          <div className={styles.StripeInput}>
            <PaymentElement />
          </div>
          {validationErrors.card && (
            <span className={styles.ErrorMessage}>{validationErrors.card}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PaymentButtonSection({ isProcessing, handlePayment }) {
  const [activePolicy, setActivePolicy] = useState(null);
  const openPolicy = (key) => setActivePolicy(POLICIES[key]);
  const closePolicy = () => setActivePolicy(null);

  return (
    <div className={styles.Six}>
      <button className={styles.Pay} onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>

      {/* <div className={styles.PageLinks}>
        <p onClick={() => openPolicy("refund")} style={{ cursor: "pointer" }}>Cancellation & Refund Policy</p>
        <p onClick={() => openPolicy("shipping")} style={{ cursor: "pointer" }}>Shipping</p>
        <p onClick={() => openPolicy("privacy")} style={{ cursor: "pointer" }}>Privacy Policy</p>
        <p onClick={() => openPolicy("terms")} style={{ cursor: "pointer" }}>Terms of service</p>
        <p onClick={() => openPolicy("contact")} style={{ cursor: "pointer" }}>Contact</p>
      </div> */}

      <PolicyModal policy={activePolicy} onClose={closePolicy} />
    </div>
  );
}

export default function PaymentSection({ validationErrors, isProcessing, handlePayment }) {
  return (
    <>
      <PaymentCardSection validationErrors={validationErrors} />
      <PaymentButtonSection isProcessing={isProcessing} handlePayment={handlePayment} />
    </>
  );
}