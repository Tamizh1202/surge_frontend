"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css";
import { ADDRESS_LABELS, UAE_STATES } from "../profileConstants";
import { validateUAEPhone } from "@/utils/validatorFunctions";

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
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({});
  const [phoneFormatError, setPhoneFormatError] = useState("");
  const emirateRef = useRef(null);

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const getRawPhone = (val) => (val ? val.replace(/^\+971/, "") : "");

  const requiredFields = {
    addressFirstName: addressForm.addressFirstName?.trim(),
    addressLastName: addressForm.addressLastName?.trim(),
    address: addressForm.address?.trim(),
    city: addressForm.city?.trim(),
    state: addressForm.state,
    phone: getRawPhone(addressForm.phone),
  };

  const isFormValid = Object.values(requiredFields).every(Boolean);

  const err = (field) =>
    touched[field] && !requiredFields[field] ? (
      <span className={styles.fieldError}>This field is required</span>
    ) : null;

  // Limits updated for Address and Street Number
  const limits = {
    firstName: 15,
    lastName: 15,
    address: 100,
    apartment: 30,
    city: 15,
    phone: 9,
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

  const isPhoneActive = focusedField === "phone" || getRawPhone(addressForm.phone).length > 0;

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
                onBlur={() => { setFocusedField(null); touch("addressFirstName"); }}
                onChange={(e) => onFormChange("addressFirstName", e.target.value)}
              />
              {(focusedField === "firstName" || addressForm.addressFirstName) && (
                <span className={styles.charCounter}>
                  {(addressForm.addressFirstName || "").length}/{limits.firstName}
                </span>
              )}
            </div>
            {err("addressFirstName")}
          </div>
          <div className={styles.flex1}>
            <div className={styles.inputWrapperWithLimit}>
              <input
                className={styles.lineInput}
                placeholder="Last Name"
                value={addressForm.addressLastName || ""}
                maxLength={limits.lastName}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => { setFocusedField(null); touch("addressLastName"); }}
                onChange={(e) => onFormChange("addressLastName", e.target.value)}
              />
              {(focusedField === "lastName" || addressForm.addressLastName) && (
                <span className={styles.charCounter}>
                  {(addressForm.addressLastName || "").length}/{limits.lastName}
                </span>
              )}
            </div>
            {err("addressLastName")}
          </div>
        </div>

        {/* Address Field with Limit */}
        <div className={styles.fieldWrapper}>
          <div className={styles.inputWrapperWithLimit}>
            <input
              className={styles.lineInput}
              placeholder="House Number, Street Name"
              value={addressForm.address || ""}
              maxLength={limits.address}
              onFocus={() => setFocusedField("address")}
              onBlur={() => { setFocusedField(null); touch("address"); }}
              onChange={(e) => onFormChange("address", e.target.value)}
            />
            {(focusedField === "address" || addressForm.address) && (
              <span className={styles.charCounter}>
                {(addressForm.address || "").length}/{limits.address}
              </span>
            )}
          </div>
          {err("address")}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div className={styles.inputWrapperWithLimit}>
            <input
              className={styles.lineInput}
              placeholder="Apartment, Suite etc."
              value={addressForm.apartment || ""}
              maxLength={limits.apartment}
              onFocus={() => setFocusedField("apartment")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => onFormChange("apartment", e.target.value)}

            />
            {(focusedField === "apartment" || addressForm.apartment) ? (
              <span className={styles.charCounter}>
                {(addressForm.apartment || "").length}/{limits.apartment}
              </span>
            ) : (
              <span className={styles.optionalTag}>(Optional)</span>
            )}
          </div>
        </div>

        {/* City + Emirate Row */}
        <div className={styles.row}>
          <div className={styles.flex1}>
            <div className={styles.inputWrapperWithLimit}>
              <input
                className={styles.lineInput}
                placeholder="City"
                value={addressForm.city || ""}
                maxLength={limits.city}
                onFocus={() => setFocusedField("city")}
                onBlur={() => { setFocusedField(null); touch("city"); }}
                onChange={(e) => onFormChange("city", e.target.value)}
              />
              {(focusedField === "city" || addressForm.city) && (
                <span className={styles.charCounter}>
                  {(addressForm.city || "").length}/{limits.city}
                </span>
              )}
              {err("city")}
            </div>
          </div>
          <div className={styles.emirateWrapper} ref={emirateRef} style={{ display: 'flex', flexDirection: 'column' }}>
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
                    touch("state");
                    setIsEmirateOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
            {err("state")}
          </div>
        </div>

        {/* Phone Section */}
        <div className={styles.phoneWrapper}>
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '6px',
              borderBottom: '1.5px solid #2f362a4d',
              paddingBottom: '8px',
              paddingTop: '8px',
            }}>
              <span style={{
                color: '#2f362a',
                fontSize: '16px',
                fontFamily: 'var(--font-raleway)',
                flexShrink: 0,
                lineHeight: 1,
              }}>
                +971
              </span>
              <input
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontFamily: 'var(--font-raleway)',
                  fontWeight: 400,
                  color: '#2f362a',
                  background: 'transparent',
                  paddingRight: '35px',
                }}
                placeholder="Phone"
                value={getRawPhone(addressForm.phone)}
                maxLength={limits.phone}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => {
                  setFocusedField(null);
                  touch("phone");
                  const raw = getRawPhone(addressForm.phone);
                  if (raw.length > 0) {
                    const err = validateUAEPhone(raw);
                    setPhoneFormatError(err);
                  } else {
                    setPhoneFormatError("");
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  onFormChange("phone", val);
                  if (phoneFormatError) setPhoneFormatError("");
                }}
              />
            </div>
            {isPhoneActive && (
              <span className={styles.charCounter} style={{ bottom: '8px' }}>
                {getRawPhone(addressForm.phone).length}/{limits.phone}
              </span>
            )}
            {(touched.phone && !requiredFields.phone) ? (
              <span style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '12px', color: '#c0392b', fontFamily: 'var(--font-raleway)' }}>This field is required</span>
            ) : phoneFormatError ? (
              <span style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '12px', color: '#c0392b', fontFamily: 'var(--font-raleway)' }}>{phoneFormatError}</span>
            ) : null}
          </div>
        </div>

        {/* Save As Labels */}
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
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={`${styles.saveBtn} ${(!isFormValid || isSubmitting) ? styles.saveBtnDisabled : ""}`}
            onClick={onSave}
            disabled={!isFormValid || isSubmitting}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPopup;