"use client";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";

export default function ExpressCheckoutSection({ onAvailabilityChange }) {
  return (
    <ExpressCheckoutElement
      onConfirm={() => { }}
      onReady={({ availablePaymentMethods }) => {
        const isAvailable = !!(availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean));
        if (onAvailabilityChange) onAvailabilityChange(isAvailable);
      }}
      onLoadError={() => {
        if (onAvailabilityChange) onAvailabilityChange(false);
      }}
    />
  );
}