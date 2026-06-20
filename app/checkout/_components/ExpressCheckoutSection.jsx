"use client";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";

export default function ExpressCheckoutSection({ onAvailabilityChange, onConfirm, onClick }) {
  return (
    <ExpressCheckoutElement
      onConfirm={onConfirm}
      onClick={onClick}
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