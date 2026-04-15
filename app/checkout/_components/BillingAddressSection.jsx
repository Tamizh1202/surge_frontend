"use client";
import styles from "../page.module.css";
import { useState, useRef, useEffect } from "react";

// TODO: replace with Surge's actual validators
const validateRequired = (val, label) =>
    !val || !val.trim() ? `${label} is required` : "";
const validateUAEPhone = (val) =>
    !val ? "Phone is required" : !/^\d{9}$/.test(val) ? "Enter a valid UAE phone" : "";

// TODO: replace with Surge's actual UAE_STATES constant
const UAE_STATES = [
    { value: "dubai", label: "Dubai" },
    { value: "abu-dhabi", label: "Abu Dhabi" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ajman", label: "Ajman" },
    { value: "fujairah", label: "Fujairah" },
    { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
    { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

export default function BillingAddressSection({
    delivery,
    useShippingAsBilling,
    setUseShippingAsBilling,
    billingForm,
    setBillingForm,
    validationErrors,
    clearError,
    setValidationErrors,
}) {
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

    const showForm = !useShippingAsBilling || delivery === "pickup";

    return (
        <div className={styles.Five} style={{ paddingTop: 0 }}>
            {delivery !== "pickup" && (
                <label className={styles.BillingToggle}>
                    <input
                        type="checkbox"
                        checked={useShippingAsBilling}
                        onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                    />
                    <p>Use shipping address as billing address</p>
                </label>
            )}

            {showForm && (
                <>
                    <h3 className={"styles.billingAddress"}>Billing Address</h3>

                    <div className={styles.FieldWrap}>
                        <input
                            className={styles.Input}
                            value="United Arab Emirates"
                            readOnly
                            placeholder=" "
                        />
                        <label className={styles.FloatLabel}>Country / Region</label>
                    </div>

                    <div className={styles.Row}>
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingFirstName ? styles.InputError : ""}`}
                                placeholder=" "
                                value={billingForm.firstName}
                                onChange={(e) => { setBillingForm({ ...billingForm, firstName: e.target.value }); clearError("billingFirstName"); }}
                                onBlur={() => { const e = validateRequired(billingForm.firstName, "First name"); if (e) setValidationErrors((p) => ({ ...p, billingFirstName: e })); }}
                            />
                            <label className={styles.FloatLabel}>First Name</label>
                            {validationErrors.billingFirstName && <span className={styles.ErrorMessage}>{validationErrors.billingFirstName}</span>}
                        </div>
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingLastName ? styles.InputError : ""}`}
                                placeholder=" "
                                value={billingForm.lastName}
                                onChange={(e) => { setBillingForm({ ...billingForm, lastName: e.target.value }); clearError("billingLastName"); }}
                                onBlur={() => { const e = validateRequired(billingForm.lastName, "Last name"); if (e) setValidationErrors((p) => ({ ...p, billingLastName: e })); }}
                            />
                            <label className={styles.FloatLabel}>Last Name</label>
                            {validationErrors.billingLastName && <span className={styles.ErrorMessage}>{validationErrors.billingLastName}</span>}
                        </div>
                    </div>

                    <div className={styles.FieldWrap}>
                        <input
                            className={`${styles.Input} ${validationErrors.billingAddress ? styles.InputError : ""}`}
                            placeholder=" "
                            value={billingForm.address}
                            onChange={(e) => { setBillingForm({ ...billingForm, address: e.target.value }); clearError("billingAddress"); }}
                            onBlur={() => { const e = validateRequired(billingForm.address, "Address"); if (e) setValidationErrors((p) => ({ ...p, billingAddress: e })); }}
                        />
                        <label className={styles.FloatLabel}>House number, Street name</label>
                        {validationErrors.billingAddress && <span className={styles.ErrorMessage}>{validationErrors.billingAddress}</span>}
                    </div>

                    <div className={styles.FieldWrap}>
                        <input
                            className={styles.Input}
                            placeholder=" "
                            value={billingForm.apartment}
                            onChange={(e) => setBillingForm({ ...billingForm, apartment: e.target.value })}
                        />
                        <label className={styles.FloatLabel}>Apartment, suite, etc. (optional)</label>
                    </div>
                    <div className={styles.Row} data-lenis-prevent>
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingCity ? styles.InputError : ""}`}
                                placeholder=" "
                                value={billingForm.city}
                                onChange={(e) => { setBillingForm({ ...billingForm, city: e.target.value }); clearError("billingCity"); }}
                                onBlur={() => { const e = validateRequired(billingForm.city, "City"); if (e) setValidationErrors((p) => ({ ...p, billingCity: e })); }}
                            />
                            <label className={styles.FloatLabel}>City</label>
                            {validationErrors.billingCity && <span className={styles.ErrorMessage}>{validationErrors.billingCity}</span>}
                        </div>
                        <div className={styles.SelectContainer} ref={emirateRef} style={{ flex: 1 }}>
                            <div className={styles.CustomSelectTrigger} onClick={() => setIsEmirateOpen(!isEmirateOpen)}>
                                <span style={{ textTransform: "capitalize" }}>
                                    {UAE_STATES.find((s) => s.value === (billingForm.emirates || "dubai"))?.label || "Select Emirate"}
                                </span>
                                <span className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}>▼</span>
                            </div>
                            {isEmirateOpen && (
                                <div className={styles.CustomOptionsList}>
                                    {UAE_STATES.map((opt) => (
                                        <div
                                            key={opt.value}
                                            className={styles.OptionItem}
                                            onClick={() => { setBillingForm({ ...billingForm, emirates: opt.value }); setIsEmirateOpen(false); clearError("billingEmirates"); }}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.FieldWrap}>
                        <div className={`${styles.PhoneWrapper} ${validationErrors.billingPhone ? styles.InputError : ""}`}>
                            <span className={styles.PhonePrefix}>+971</span>
                            <input
                                className={styles.PhoneInput}
                                placeholder="Phone"
                                value={billingForm.phone}
                                inputMode="numeric"
                                onChange={(e) => { const numeric = e.target.value.replace(/\D/g, ""); setBillingForm({ ...billingForm, phone: numeric }); clearError("billingPhone"); }}
                                onBlur={() => { const e = validateUAEPhone(billingForm.phone); if (e) setValidationErrors((p) => ({ ...p, billingPhone: e })); }}
                            />

                        </div>
                        {validationErrors.billingPhone && <span className={styles.ErrorMessage}>{validationErrors.billingPhone}</span>}
                    </div>

                </>

            )}
        </div>
    );
}