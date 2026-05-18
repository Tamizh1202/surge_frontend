"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css";
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
  const [focusedField, setFocusedField] = useState(null);
  const emirateRef = useRef(null);

  // Limits updated for Address and Street Number
  const limits = {
    firstName: 15,
    lastName: 15,
    address: 15,       // Address limit
    streetNumber: 15,  // Street Number limit
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

  const getRawPhone = (val) => (val ? val.replace(/^\+971/, "") : "");
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
                onBlur={() => setFocusedField(null)}
                onChange={(e) => onFormChange("addressFirstName", e.target.value)}
              />
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

        {/* Address Field with Limit */}
        <div className={styles.fieldWrapper}>
          <div className={styles.inputWrapperWithLimit}>
            <input
              className={styles.lineInput}
              placeholder="House Number, Street Name"
              value={addressForm.address || ""}
              maxLength={limits.address}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => onFormChange("address", e.target.value)}
            />
            {(focusedField === "address" || addressForm.address) && (
              <span className={styles.charCounter}>
                {(addressForm.address || "").length}/{limits.address}
              </span>
            )}
          </div>
        </div>

        {/* Street Number Field with Limit */}
        <div className={styles.fieldWrapper}>
          <div className={styles.inputWrapperWithLimit}>
            <input
              className={styles.lineInput}
              placeholder="Street Number"
              value={addressForm.streetNumber || ""}
              maxLength={limits.streetNumber}
              onFocus={() => setFocusedField("streetNumber")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => onFormChange("streetNumber", e.target.value)}
            />
            {(focusedField === "streetNumber" || addressForm.streetNumber) && (
              <span className={styles.charCounter}>
                {(addressForm.streetNumber || "").length}/{limits.streetNumber}
              </span>
            )}
          </div>
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

        {/* Phone Section */}
     
<div className={styles.phoneWrapper}>
  <div className={styles.inputWrapperWithLimit}>
    <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
      
      {/* Prefix aur Placeholder Logic */}
      <div style={{ 
        position: "absolute", 
        left: 0, 
        bottom: "8px", 
        display: "flex", 
        gap: "16px", 
        pointerEvents: "none",
        fontSize: "14px"
      }}>
      
        <span style={{ color: "#2f362a" , }}>+971</span>
        
   
        {!getRawPhone(addressForm.phone) && (
          <span style={{ color: "#818686" ,fontSize: "16px",
  fontWeight: "400",
  fontFamily: 'Raleway'}}>Phone</span>
        )}
      </div>
      
      <input
        className={styles.lineInput}
        style={{ 
          paddingLeft: "45px", // Prefix ke liye jagah
          color: "#000" 
        }}
        // Native placeholder ko khali rakha hai kyunki humne custom span use kiya hai
        placeholder="" 
        value={getRawPhone(addressForm.phone)}
        maxLength={limits.phone}
        onFocus={() => setFocusedField("phone")}
        onBlur={() => setFocusedField(null)}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, ""); 
          onFormChange("phone", "+971" + val);
        }}
      />
      
      {/* Counter: Sirf typed numbers ginega */}
      {(focusedField === "phone" || getRawPhone(addressForm.phone)) && (
        <span className={styles.charCounter}>
          {getRawPhone(addressForm.phone).length}/{limits.phone}
        </span>
      )}
    </div>
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