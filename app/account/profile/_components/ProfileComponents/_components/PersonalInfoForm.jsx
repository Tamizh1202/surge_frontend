"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../ProfileComponents.module.css";

const PersonalInfoForm = ({
  profile,
  editMode,
  errors,
  isGuestUser,
  originalEmail,
  onFieldChange,
  onSave,
  onCancel,
  onVerifyEmail,
  showOtpPopup,
  otpNode,
}) => {
  // --- State for Custom Gender Dropdown ---
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderRef = useRef(null);

  // --- State for API Errors (e.g., "OTP limit reached") ---
  const [emailError, setEmailError] = useState("");

  // --- Click Outside logic for Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Local handler for Email Verification ---
  const handleVerifyClick = async () => {
    setEmailError(""); // Clear previous error

    // This awaits the parent's handleVerifyEmail, which returns the API result
    const result = await onVerifyEmail(profile.email);

    // If API utility returns success: false, display the specific message
    if (result && result.success === false) {
      setEmailError(result.message);
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <div className={styles.PersonalInfoSection}>
      {isGuestUser && (
        <p className={styles.GuestNote}>
          Please login to manage your profile details.
        </p>
      )}

      <div className={styles.AddressHeader}>
        <h4>Personal Information</h4>
        {!editMode && (
          <button
            style={{ textDecoration: "underline", paddingRight: "10px" }}
            onClick={() => onFieldChange("__editMode__", true)}
          >
            Edit
          </button>
        )}
      </div>

      {/* First name + Last name row */}
      {/* First name + Last name row */}
      <div className={styles.Name}>
        {editMode ? (
          <>
            <div className={styles.Field}>
              <input
                value={profile.firstName || ""}
                placeholder="First name"
                disabled={isGuestUser}
                onChange={(e) => onFieldChange("firstName", e.target.value)}
              />
            </div>
            <div className={styles.Field}>
              <input
                value={profile.lastName || ""}
                placeholder="Last name"
                disabled={isGuestUser}
                onChange={(e) => onFieldChange("lastName", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.Field}>
              <input
                value={profile.firstName || ""}
                placeholder={!isGuestUser ? "First name" : ""}
                disabled
              />
            </div>
            <div className={styles.Field}>
              <input
                value={profile.lastName || ""}
                placeholder={!isGuestUser ? "Last name" : ""}
                disabled
              />
            </div>
          </>
        )}
      </div>

      {/* Email + OTP trigger */}
      <div
        className={styles.FieldContainer}
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <div className={styles.Field}>
          <input
            value={profile.email || ""}
            placeholder={
              isGuestUser ? "Login to view email" : "Enter your email address"
            }
            disabled={!editMode || isGuestUser}
            onChange={(e) => {
              setEmailError(""); // Clear red error when typing
              onFieldChange("email", e.target.value);
            }}
          />
          {editMode && !isGuestUser && profile.email !== originalEmail && (
            <span className={styles.VerifyBtn} onClick={handleVerifyClick}>
              Verify
            </span>
          )}
        </div>

        {/* --- The Red Error Message --- */}

        {showOtpPopup && otpNode}
      </div>

      {/* Phone + Gender row */}
      <div className={styles.Row}>
        <div className={styles.Field}>
          <span className={styles.PhonePrefix}>+971</span>
          <input
            value={profile.phone || ""}
            placeholder={
              editMode ? "Add your phone number" : "No phone number added"
            }
            disabled={!editMode || isGuestUser}
            onChange={(e) => onFieldChange("phone", e.target.value)}
          />
        </div>

        <div className={styles.Field} ref={genderRef}>
          {editMode ? (
            /* Editable Mode */
            <div className={`${styles.SelectContainer}${styles.width}`} 
            // style={{ position: "relative" }}
            >
              <div
                className={styles.CustomSelectTrigger}
                onClick={() => setIsGenderOpen(!isGenderOpen)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {profile.gender || "Gender"}
                </span>
                <svg
                  width="17"
                  height="9"
                  viewBox="0 0 17 9"
                  fill="none"
                  style={{
                    transform: isGenderOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                  }}
                >
                  <path d="M8.27175 9L-0.000935071 7.02781e-07L16.5444 -1.71995e-06L8.27175 9Z" fill="#414343" />
                </svg>
              </div>

              {isGenderOpen && (
                <div className={styles.CustomOptionsList}>
                  {genderOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={styles.OptionItem}
                      onClick={() => {
                        onFieldChange("gender", opt.value);
                        setIsGenderOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Read-only Mode (Ab icon ke saath) */
            <div
              className={styles.underlineSelect}
              // style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "default" }}
            >
              <span style={{ textTransform: "capitalize" }}>
                {profile.gender || "Gender"}
              </span>
              <svg width="17" height="9" viewBox="0 0 17 9" fill="none">
                <path d="M8.27175 9L-0.000935071 7.02781e-07L16.5444 -1.71995e-06L8.27175 9Z" fill="#ffffff" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {errors.general && (
        <p className={styles.ErrorText} style={{ marginTop: "8px" }}>
          {errors.general}
        </p>
      )}

      {errors.firstName && (
        <p className={styles.ErrorText}>{errors.firstName}</p>
      )}

      {errors.lastName && <p className={styles.ErrorText}>{errors.lastName}</p>}
      {errors.email && <p className={styles.ErrorText}>{errors.email}</p>}
      {emailError && <p className={styles.ErrorText}>{emailError}</p>}

      {errors.phone && <p className={styles.ErrorText}>{errors.phone}</p>}

      {editMode && !isGuestUser && (
        <div className={styles.ActionRow}>
          <button className={styles.SaveBtn} onClick={onSave}>
            Save Changes
          </button>
          <button className={styles.CancelBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;
