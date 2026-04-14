"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css";
import { ADDRESS_LABELS, UAE_STATES } from "../profileConstants";

const AddressFormPopup = ({
  mode,
  addressForm,
  addressErrors,
  addressGeneralError,
  activeLabelBtn,
  onFormChange,
  onLabelSelect,
  onSave,
  onCancel,
  isSubmitting,
}) => {
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const emirateRef = useRef(null);

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
    <div className={styles.PopupOverlay} onClick={onCancel}>
      <div className={styles.Popup} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '40px' }}>
        <h3 style={{ 
          fontFamily: 'var(--font-montserrat)', 
          fontSize: '22px', 
          fontWeight: '600', 
          marginBottom: '32px',
          color: '#2F362A' 
        }}>{title}</h3>

     
        <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '16px', color: '#818686', display: 'block', marginBottom: '4px',  fontFamily: 'var(--font-raleway)',  }}>Country / Region</label>
          <input
            style={{ 
              border: 'none', 
              borderBottom: '1.5px solid #2F362A4D', 
              width: '100%', 
               fontFamily: 'var(--font-raleway)', 
                fontWeight: '600', 
              padding: '8px 0', 
              fontSize: '16px', 
              color: '#414343',
              outline: 'none',
              background: 'transparent'
            }}
            value="United Arab Emirates"
            readOnly
          />
        </div>

        {/* Name Row */}
        <div className={styles.divide} style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <input
              className={styles.lineInput}
              placeholder="First Name"
              value={addressForm.addressFirstName || ""}
              onChange={(e) => onFormChange("addressFirstName", e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              className={styles.lineInput}
              placeholder="Last Name"
              value={addressForm.addressLastName || ""}
              onChange={(e) => onFormChange("addressLastName", e.target.value)}
            />
          </div>
        </div>

        {/* Street */}
        <div style={{ marginBottom: '24px' }}>
          <input
            className={styles.lineInput}
            placeholder="House Number, Street Name"
            value={addressForm.address || ""}
            onChange={(e) => onFormChange("address", e.target.value)}
          />
        </div>

        {/* Apartment */}
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <input
            className={styles.lineInput}
            placeholder="Apartment, Suit etc."
            value={addressForm.apartment || ""}
            onChange={(e) => onFormChange("apartment", e.target.value)}
          />
          <span style={{ position: 'absolute', right: 0, bottom: '8px', color: '#A0A0A0', fontSize: '16px' }}>(Optional)</span>
        </div>

        {/* City + Emirate */}
        <div className={styles.divide} style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <input
              className={styles.lineInput}
              placeholder="City"
              value={addressForm.city || ""}
              onChange={(e) => onFormChange("city", e.target.value)}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }} ref={emirateRef}>
            <div 
              onClick={() => setIsEmirateOpen(!isEmirateOpen)}
              style={{ 
                borderBottom: '1.5px solid #2F362A4D', 
                padding: '8px 0', 
                  fontFamily: 'var(--font-raleway)', 
                fontWeight: '400', 
                 fontSize: '16px', 
                display: 'flex', 
                color: '#818686',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: addressForm.state ? '#2F362A' : '#A0A0A0'
              }}
            >
              <span>{UAE_STATES.find(s => s.value === addressForm.state)?.label || "Emirate"}</span>
              <span style={{ fontSize: '16px' }}>▼</span>
            </div>
            {isEmirateOpen && (
              <div className={styles.CustomOptionsList} style={{ width: '100%', top: '100%', zIndex: 10 }}>
                {UAE_STATES.map((opt) => (
                  <div key={opt.value} className={styles.OptionItem} onClick={() => { onFormChange("state", opt.value); setIsEmirateOpen(false); }}>
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '32px' }}>
          <input
            className={styles.lineInput}
            placeholder="Phone"
            value={addressForm.phone ? addressForm.phone.replace(/^\+971\s?/, "") : ""}
            onChange={(e) => onFormChange("phone", "+971" + e.target.value)}
          />
        </div>

        {/* Save As Labels */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '32px' }}>Save As</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {ADDRESS_LABELS.map((label) => (
              <div 
                key={label} 
                onClick={() => onLabelSelect(label)}
                style={{ 
                  cursor: 'pointer',
                  paddingBottom: '4px',
                  borderBottom: activeLabelBtn === label ? '2px solid #C4754E' : '1px solid #2F362A4D',
                  color: activeLabelBtn === label ? '#C4754E' : '#A0A0A0',
                  minWidth: '156px',
                   fontFamily: 'var(--font-raleway)', 
                fontWeight: '400', 
                 color: '#818686',
                 fontSize: '16px', 
                  transition: '0.3s'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '16px',
              background: 'transparent',
              border: '1.5px solid #C4754E',
              color: '#C4754E',
             
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px',
              background: '#C4754E',
              border: 'none',
              color: '#fff',
             
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormPopup;