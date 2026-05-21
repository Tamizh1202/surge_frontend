"use client";
import React, { useState } from "react";
import styles from "./CancelOrderPopup.module.css";

const CancelOrderPopup = ({ onClose, onConfirm, orderId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MIN_CHAR_LIMIT = 10;
  const MAX_CHAR_LIMIT = 250;
  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Delivery time is too long",
    "Found a better alternative",
    "Other",
  ];

  const handleConfirm = async () => {
    const finalReason = selectedReason === "Other" ? otherReasonText : selectedReason;

    if (selectedReason === "Other" && otherReasonText.length < MIN_CHAR_LIMIT) {
      setError(`Please provide at least ${MIN_CHAR_LIMIT} characters.`);
      return;
    }

    setIsSubmitting(true);
    await onConfirm(finalReason); // Triggers API call in OrderCard
    setIsSubmitting(false);
  };

  const isButtonDisabled = !selectedReason || isSubmitting || (selectedReason === "Other" && otherReasonText.trim().length < MIN_CHAR_LIMIT);

  return (
    <div className={styles.PopupOverlay} onClick={onClose}>
      <div className={styles.Popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="#6E736A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={styles.content}>
          <h3>Cancel Order #{orderId}</h3>
          <p className={styles.description}>Please let us know why you're cancelling this order.</p>

          <div className={styles.reasonsContainer}>
            {reasons.map((reason, index) => (
              <div key={index}>
                <label className={styles.reasonItem}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setError("");
                    }}
                  />
                  <span className={styles.radioCustom}></span>
                  <span className={styles.reasonText}>{reason}</span>
                </label>
                
                {reason === "Other" && selectedReason === "Other" && (
                  <div className={styles.otherTextAreaContainer}>
                    <textarea
                      className={styles.otherTextArea}
                      placeholder="Please specify your reason"
                      value={otherReasonText}
                      maxLength={MAX_CHAR_LIMIT}
                      disabled={isSubmitting}
                      onChange={(e) => setOtherReasonText(e.target.value)}
                    />
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <p className={styles.charCount}>{otherReasonText.length}/{MAX_CHAR_LIMIT}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.PopupActions}>
            <button className={styles.KeepBtn} onClick={onClose} disabled={isSubmitting}>
              Keep order
            </button>
            <button 
              className={styles.CancelBtn} 
              onClick={handleConfirm} 
              disabled={isButtonDisabled}
            >
              {isSubmitting ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderPopup;