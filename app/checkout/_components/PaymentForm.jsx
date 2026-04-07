"use client";
import { useState } from "react";
import styles from "../Checkout.module.css"

export default function Payment() {
    const [useSameAddress, setUseSameAddress] = useState(true);
    const [showCvv, setShowCvv] = useState(false);

    const [card, setCard] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: "",
    });
    const update = (k) => (e) => setCard((p) => ({ ...p, [k]: e.target.value }));
    /* ── format helpers ── */
    const fmtCardNumber = (val) =>
        val
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();
    const fmtExpiry = (val) => {
        const digits = val.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
        return digits;
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>

            <p className={styles.secureNote}>
                <span>🔒</span> All transactions are secure and encrypted
            </p>

            <div className={styles.paymentMethodBlock}>
                {/* Header */}
                <div className={styles.paymentMethodHeader}>
                    <div className={`${styles.radioCustom} ${styles.active}`}>
                        <span className={styles.radioDot} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Debit Card</span>
                    <div className={styles.cardIconsRow}>
                        <span className={`${styles.cardBadge} ${styles.visa}`}>VISA</span>
                        <span className={`${styles.cardBadge} ${styles.mc}`}>MC</span>
                        <span className={`${styles.cardBadge} ${styles.amex}`}>AMEX</span>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.paymentMethodBody}>
                    {/* Card Number */}
                    <div className={`${styles.field} ${styles.fieldWithIcon}`}>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Card Number"
                            value={card.number}
                            onChange={(e) =>
                                setCard((p) => ({ ...p, number: fmtCardNumber(e.target.value) }))
                            }
                        />
                        <span className={styles.fieldIcon}>💳</span>
                    </div>

                    {/* Expiry / CVV */}
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Expiration Date (MM/YYYY)"
                                value={card.expiry}
                                onChange={(e) =>
                                    setCard((p) => ({ ...p, expiry: fmtExpiry(e.target.value) }))
                                }
                            />
                        </div>
                        <div className={`${styles.field} ${styles.fieldWithIcon}`}>
                            <input
                                type={showCvv ? "text" : "password"}
                                inputMode="numeric"
                                placeholder="Card Number"
                                maxLength={4}
                                value={card.cvv}
                                onChange={update("cvv")}
                            />
                            <span
                                className={styles.fieldIcon}
                                onClick={() => setShowCvv((v) => !v)}
                                title={showCvv ? "Hide CVV" : "Show CVV"}
                                style={{ cursor: "pointer" }}
                            >
                                {showCvv ? "🙈" : "👁"}
                            </span>
                        </div>
                    </div>

                    {/* Name on Card */}
                    <div className={styles.field}>
                        <input
                            type="text"
                            placeholder="Name on Card"
                            value={card.name}
                            onChange={update("name")}
                            autoComplete="cc-name"
                        />
                    </div>
                </div>
            </div>

            {/* Use Shipping Address as Billing */}
            <div className={styles.checkRow}>
                <input
                    type="checkbox"
                    id="sameAddress"
                    checked={useSameAddress}
                    onChange={(e) => setUseSameAddress(e.target.checked)}
                />
                <label htmlFor="sameAddress">Use Shipping Address as Billing Address</label>

                
            </div>
            
        </div>
    );
}