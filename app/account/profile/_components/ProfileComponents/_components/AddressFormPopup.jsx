"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css"
import { ADDRESS_LABELS, UAE_STATES } from "../profileConstants";

const AddressFormPopup = ({
  mode,
  addressForm,
  onFormChange,
  onLabelSelect,
  onSave,
  onCancel,
  isSubmitting,
  activeLabelBtn,
}) => {
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // Track which input is clicked
  const emirateRef = useRef(null);

  const limits = {
    firstName: 15,
    lastName: 15,
    city: 15,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emirateRef.current && !emirateRef.current.contains(event.target)) {
        setIsEmirateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title = mode === "edit" ? "Edit address" : "Add address";
  const saveLabel = isSubmitting ? "Saving..." : "Save";

  return (
    <div className={styles.popupOverlay} onClick={onCancel}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.popupTitle}>{title}</h3>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Country / Region</label>
          <input
            className={styles.readOnlyInput}
            value="United Arab Emirates"
            readOnly
          />
        </div>

        {/* Name Row */}
        <div className={styles.row}>
          <div className={styles.flex1}>
            <div className={styles.inputWrapperWithLimit}>
              <input
                className={styles.lineInput}
                placeholder="First Name"
                value={addressForm.addressFirstName || ""}
                maxLength={limits.firstName}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => onFormChange("addressFirstName", e.target.value)}
              />
              {/* Show only if focused OR if there is already text inside */}
              {(focusedField === "firstName" || addressForm.addressFirstName) && (
                <span className={styles.charCounter}>
                  {(addressForm.addressFirstName || "").length}/{limits.firstName}
                </span>
              )}
            </div>
          </div>
          <div className={styles.flex1}>
            <div className={styles.inputWrapperWithLimit}>
              <input
                className={styles.lineInput}
                placeholder="Last Name"
                value={addressForm.addressLastName || ""}
                maxLength={limits.lastName}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => onFormChange("addressLastName", e.target.value)}
              />
              {(focusedField === "lastName" || addressForm.addressLastName) && (
                <span className={styles.charCounter}>
                  {(addressForm.addressLastName || "").length}/{limits.lastName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <input
            className={styles.lineInput}
            placeholder="House Number, Street Name"
            value={addressForm.address || ""}
            onChange={(e) => onFormChange("address", e.target.value)}
          />
        </div>

        <div className={styles.fieldWrapperRelative}>
          <input
            className={styles.lineInput}
            placeholder="Apartment, Suit etc."
            value={addressForm.apartment || ""}
            onChange={(e) => onFormChange("apartment", e.target.value)}
          />
          <span className={styles.optionalTag}>(Optional)</span>
        </div>

        {/* City + Emirate */}
        <div className={styles.row}>
          <div className={styles.flex1}>
            <div className={styles.inputWrapperWithLimit}>
              <input
                className={styles.lineInput}
                placeholder="City"
                value={addressForm.city || ""}
                maxLength={limits.city}
                onFocus={() => setFocusedField("city")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => onFormChange("city", e.target.value)}
              />
              {(focusedField === "city" || addressForm.city) && (
                <span className={styles.charCounter}>
                  {(addressForm.city || "").length}/{limits.city}
                </span>
              )}
            </div>
          </div>
          <div className={styles.emirateWrapper} ref={emirateRef}>
            <div
              className={styles.emirateField}
              onClick={() => setIsEmirateOpen(!isEmirateOpen)}
            >
              <span className={`${styles.emirateValue} ${addressForm.state ? styles.emirateSelected : ""}`}>
                {UAE_STATES.find((s) => s.value === addressForm.state)?.label || "Emirate"}
              </span>
              <span className={`${styles.arrow} ${isEmirateOpen ? styles.arrowRotated : ""}`}>
                ▼
              </span>
            </div>

            <div className={`${styles.customOptionsList} ${isEmirateOpen ? styles.open : ""}`}>
              {UAE_STATES.map((opt) => (
                <div
                  key={opt.value}
                  className={styles.optionItem}
                  onClick={() => {
                    onFormChange("state", opt.value);
                    setIsEmirateOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.phoneWrapper}>
          <input
            className={styles.lineInput}
            placeholder="Phone"
            value={addressForm.phone ? addressForm.phone.replace(/^\+971\s?/, "") : ""}
            onChange={(e) => onFormChange("phone", "+971" + e.target.value)}
          />
        </div>

        {/* Save As */}
        <div className={styles.saveAsWrapper}>
          <p className={styles.saveAsTitle}>Save As</p>
          <div className={styles.labelGroup}>
            {ADDRESS_LABELS.map((label) => (
              <div
                key={label}
                onClick={() => onLabelSelect(label)}
                className={`${styles.labelBtn} ${activeLabelBtn === label ? styles.labelBtnActive : ""}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footerActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`${styles.saveBtn} ${isSubmitting ? styles.saveBtnDisabled : ""}`}
            onClick={onSave}
            disabled={isSubmitting}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPopup;