"use client";
import styles from "../page.module.css";
import { useState, useRef, useEffect } from "react";

// TODO: replace with Surge's actual validators
const validateRequired = (val, label) =>
    !val || !val.trim() ? `${label} is required` : "";
const validateUAEPhone = (val) =>
    !val ? "Phone is required" : !/^\d{9}$/.test(val) ? "Enter a valid UAE phone" : "";

export default function BillingAddressSection({
    delivery,
    useShippingAsBilling,
    setUseShippingAsBilling,
    billingForm,
    setBillingForm,
    validationErrors,
    clearError,
    setValidationErrors,
    emirateOptions = [],
}) {
    const [isEmirateOpen, setIsEmirateOpen] = useState(false);
    const emirateRef = useRef(null);

    // Character Limit Constants
    const PHONE_MAX_LENGTH = 9;
    const NAME_MAX_LENGTH = 15;
    const ADDRESS_MAX_LENGTH = 100;
    const APARTMENT_MAX_LENGTH = 100;
    const CITY_MAX_LENGTH = 15;

    const [activeField, setActiveField] = useState(null);

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
                        {/* FIRST NAME */}
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingFirstName ? styles.InputError : ""}`}
                                placeholder=" "
                                maxLength={NAME_MAX_LENGTH}
                                value={billingForm.firstName || ""}
                                onFocus={() => setActiveField("firstName")}
                                onChange={(e) => { 
                                    setBillingForm({ ...billingForm, firstName: e.target.value }); 
                                    clearError("billingFirstName"); 
                                }}
                                onBlur={() => { 
                                    setActiveField(null);
                                    const e = validateRequired(billingForm.firstName, "First name"); 
                                    if (e) setValidationErrors((p) => ({ ...p, billingFirstName: e })); 
                                }}
                            />
                            <label className={styles.FloatLabel}>First Name</label>
                            {activeField === "firstName" && (
                                <span className={styles.CharCounter}>{(billingForm.firstName || "").length}/{NAME_MAX_LENGTH}</span>
                            )}
                            {validationErrors.billingFirstName && <span className={styles.ErrorMessage}>{validationErrors.billingFirstName}</span>}
                        </div>

                        {/* LAST NAME */}
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingLastName ? styles.InputError : ""}`}
                                placeholder=" "
                                maxLength={NAME_MAX_LENGTH}
                                value={billingForm.lastName || ""}
                                onFocus={() => setActiveField("lastName")}
                                onChange={(e) => { 
                                    setBillingForm({ ...billingForm, lastName: e.target.value }); 
                                    clearError("billingLastName"); 
                                }}
                                onBlur={() => { 
                                    setActiveField(null);
                                    const e = validateRequired(billingForm.lastName, "Last name"); 
                                    if (e) setValidationErrors((p) => ({ ...p, billingLastName: e })); 
                                }}
                            />
                            <label className={styles.FloatLabel}>Last Name</label>
                            {activeField === "lastName" && (
                                <span className={styles.CharCounter}>{(billingForm.lastName || "").length}/{NAME_MAX_LENGTH}</span>
                            )}
                            {validationErrors.billingLastName && <span className={styles.ErrorMessage}>{validationErrors.billingLastName}</span>}
                        </div>
                    </div>

                    {/* HOUSE NUMBER, STREET NAME */}
                    <div className={styles.FieldWrap}>
                        <input
                            className={`${styles.Input} ${validationErrors.billingAddress ? styles.InputError : ""}`}
                            placeholder=" "
                            maxLength={ADDRESS_MAX_LENGTH}
                            value={billingForm.address || ""}
                            onFocus={() => setActiveField("address")}
                            onChange={(e) => { 
                                setBillingForm({ ...billingForm, address: e.target.value }); 
                                clearError("billingAddress"); 
                            }}
                            onBlur={() => { 
                                setActiveField(null);
                                const e = validateRequired(billingForm.address, "Address"); 
                                if (e) setValidationErrors((p) => ({ ...p, billingAddress: e })); 
                            }}
                        />
                        <label className={styles.FloatLabel}>House number, Street name</label>
                        {activeField === "address" && (
                            <span className={styles.CharCounter}>{(billingForm.address || "").length}/{ADDRESS_MAX_LENGTH}</span>
                        )}
                        {validationErrors.billingAddress && <span className={styles.ErrorMessage}>{validationErrors.billingAddress}</span>}
                    </div>

                    {/* APARTMENT, SUITE, ETC. */}
                    <div className={styles.FieldWrap}>
                        <input
                            className={styles.Input}
                            placeholder=" "
                            maxLength={APARTMENT_MAX_LENGTH}
                            value={billingForm.apartment || ""}
                            onFocus={() => setActiveField("apartment")}
                            onChange={(e) => setBillingForm({ ...billingForm, apartment: e.target.value })}
                            onBlur={() => setActiveField(null)}
                        />
                        <label className={styles.FloatLabel}>Apartment, suite, etc. (optional)</label>
                        {activeField === "apartment" && (
                            <span className={styles.CharCounter}>{(billingForm.apartment || "").length}/{APARTMENT_MAX_LENGTH}</span>
                        )}
                    </div>

                    <div className={styles.Row} data-lenis-prevent>
                        {/* CITY */}
                        <div className={styles.FieldWrap} style={{ flex: 1 }}>
                            <input
                                className={`${styles.Input} ${validationErrors.billingCity ? styles.InputError : ""}`}
                                placeholder=" "
                                maxLength={CITY_MAX_LENGTH}
                                value={billingForm.city || ""}
                                onFocus={() => setActiveField("city")}
                                onChange={(e) => { 
                                    setBillingForm({ ...billingForm, city: e.target.value }); 
                                    clearError("billingCity"); 
                                }}
                                onBlur={() => { 
                                    setActiveField(null);
                                    const e = validateRequired(billingForm.city, "City"); 
                                    if (e) setValidationErrors((p) => ({ ...p, billingCity: e })); 
                                }}
                            />
                            <label className={styles.FloatLabel}>City</label>
                            {activeField === "city" && (
                                <span className={styles.CharCounter}>{(billingForm.city || "").length}/{CITY_MAX_LENGTH}</span>
                            )}
                            {validationErrors.billingCity && <span className={styles.ErrorMessage}>{validationErrors.billingCity}</span>}
                        </div>

                        {/* EMIRATE SELECT */}
                        <div className={styles.SelectContainer} ref={emirateRef} style={{ flex: 1 }}>
                            <div className={styles.CustomSelectTrigger} onClick={() => setIsEmirateOpen(!isEmirateOpen)}>
                                <span style={{ textTransform: "capitalize" }}>
                                    {emirateOptions.find((s) => s.value === (billingForm.emirates || "dubai"))?.label || "Select Emirate"}
                                </span>
                                <span className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}>▼</span>
                            </div>
                            {isEmirateOpen && (
                                <div className={styles.CustomOptionsList}>
                                    {emirateOptions.map((opt) => (
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

                    {/* PHONE FIELD */}
                    <div className={styles.FieldWrap}>
                        <div className={`${styles.PhoneWrapper} ${validationErrors.billingPhone ? styles.InputError : ""}`}>
                            <span className={styles.PhonePrefix}>+971</span>
                            <input
                                className={styles.PhoneInput}
                                placeholder="Phone"
                                value={billingForm.phone || ""}
                                inputMode="numeric"
                                maxLength={PHONE_MAX_LENGTH}
                                onFocus={() => setActiveField("phone")}
                                onChange={(e) => { 
                                    const numeric = e.target.value.replace(/\D/g, ""); 
                                    if (numeric.length <= PHONE_MAX_LENGTH) {
                                        setBillingForm({ ...billingForm, phone: numeric }); 
                                        clearError("billingPhone"); 
                                    }
                                }}
                                onBlur={() => { 
                                    setActiveField(null);
                                    const e = validateUAEPhone(billingForm.phone); 
                                    if (e) setValidationErrors((p) => ({ ...p, billingPhone: e })); 
                                }}
                            />
                            {activeField === "phone" && (
                                <span className={styles.CharCounter}>{(billingForm.phone || "").length}/{PHONE_MAX_LENGTH}</span>
                            )}
                        </div>
                        {validationErrors.billingPhone && <span className={styles.ErrorMessage}>{validationErrors.billingPhone}</span>}
                    </div>
                </>
            )}
        </div>
    );
}