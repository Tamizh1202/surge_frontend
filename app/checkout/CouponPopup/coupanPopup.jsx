"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./coupanPopup.module.css";

const couponsData = [
    { id: 1, code: "TRY20", savings: "You save AED 99", description: "Save AED 20 on your first specialty coffee purchase.", discount: 20 },
    { id: 2, code: "TRY20", savings: "You save AED 99", description: "Save AED 20 on your first specialty coffee purchase.", discount: 20 },
    { id: 3, code: "SAVE50", savings: "You save AED 50", description: "Flat AED 50 off on orders above AED 500.", discount: 50 },
    { id: 4, code: "WELCOME10", savings: "You save AED 10", description: "Welcome discount for new customers.", discount: 10 },
    { id: 5, code: "FREESHIP", savings: "You save AED 20", description: "Free shipping on your next order.", discount: 20 },
    { id: 6, code: "BUNDLE30", savings: "You save AED 30", description: "Bundle 3 or more items and save AED 30.", discount: 30 },
];

export default function CouponsPopup({ cartValue = 1550, onApply, onClose }) {
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);
    const [applied, setApplied] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (!mounted) return null;

    const filtered = couponsData.filter(
        (c) =>
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleApply = (coupon) => {
        setApplied(coupon.id);
        onApply?.(coupon);
    };

    const content = (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={onClose}>
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.654 11.3075L0 5.65375L5.654 0L6.70775 1.0845L2.8885 4.90375H15.404V6.40375H2.8885L6.70775 10.223L5.654 11.3075Z" fill="#414343" />
                        </svg>
                    </button>
                    <div className={styles.upperText}>
                        <h2 className={styles.title}>Coupons and Offers</h2>
                        <p className={styles.cartValue}>Cart value : AED {cartValue.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.inputRow}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Discount code or coupon"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className={styles.applyInputBtn}
                        onClick={() => {
                            const match = couponsData.find(
                                (c) => c.code.toLowerCase() === search.toLowerCase()
                            );
                            if (match) handleApply(match);
                        }}
                    >
                        Apply
                    </button>
                </div>

                <p className={styles.offersLabel} style={{ marginBottom: "16px" }}>Available Offers</p>

                <ul className={styles.couponList}>
                    {filtered.length === 0 && (
                        <li className={styles.empty}>No coupons match "{search}"</li>
                    )}
                    {filtered.map((coupon) => (
                        <li
                            key={coupon.id}
                            className={`${styles.couponCard} ${applied === coupon.id ? styles.couponApplied : ""}`}
                        >
                            <div className={styles.couponBody}>
                                <div className={styles.couponLeft}>
                                    <div className={styles.couponCodeRow}>
                                        <span className={styles.couponCode}>{coupon.code}</span>
                                    </div>
                                    <div className={styles.couponDesc}>
                                        <p className={styles.savings}>{coupon.savings}</p>
                                        <p className={styles.description}>{coupon.description}</p>
                                    </div>
                                    <button
                                        className={styles.knowMore}
                                        onClick={() => setExpanded(expanded === coupon.id ? null : coupon.id)}
                                    >
                                        {expanded === coupon.id ? "Show less" : "Know more"}
                                    </button>
                                    {expanded === coupon.id && (
                                        <p className={styles.expandedText}>
                                            Use code <strong>{coupon.code}</strong> at checkout. Valid on all orders.
                                            Discount of AED {coupon.discount} will be applied automatically.
                                        </p>
                                    )}
                                </div>
                                <button
                                    className={`${styles.applyNowBtn} ${applied === coupon.id ? styles.appliedBtn : ""}`}
                                    onClick={() => handleApply(coupon)}
                                >
                                    {applied === coupon.id ? "Applied ✓" : "Apply now"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}