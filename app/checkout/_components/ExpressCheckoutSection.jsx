"use client";
import { useState } from "react";
import styles from "../page.module.css";

// TODO: replace with real @stripe/react-stripe-js ExpressCheckoutElement when wiring Stripe
const ExpressCheckoutElement = ({ onReady }) => {
  // Simulate the "no methods available" state by default so the section stays hidden,
  // matching White Mantis behavior in environments without Apple Pay / Google Pay.
  return (
    <div
      style={{
        padding: "12px",
        border: "1px dashed #ccc",
        borderRadius: "6px",
        textAlign: "center",
        color: "#888",
      }}
    >
      Express Checkout (Stripe placeholder)
    </div>
  );
};

export default function ExpressCheckoutSection() {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <div className={styles.One} style={!isAvailable ? { display: "none" } : {}}>
      <p>Express Checkout</p>
      <ExpressCheckoutElement
        onConfirm={() => {}}
        onReady={({ availablePaymentMethods } = {}) => {
          if (
            availablePaymentMethods &&
            Object.values(availablePaymentMethods).some(Boolean)
          ) {
            setIsAvailable(true);
          }
        }}
        onLoadError={() => {
          setIsAvailable(false);
        }}
      />
    </div>
  );
}