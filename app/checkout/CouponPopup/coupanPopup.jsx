"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti"; 
import styles from "./coupanPopup.module.css";

const couponsData = [
  { id: 1, code: "TRY20", savings: "You save AED 20", description: "Save AED 20 on your first specialty coffee purchase.", discount: 20 },
  { id: 2, code: "SAVE50", savings: "You save AED 50", description: "Flat AED 50 off on orders above AED 500.", discount: 50 },
  { id: 3, code: "WELCOME10", savings: "You save AED 10", description: "Welcome discount for new customers.", discount: 10 },
  { id: 4, code: "FREESHIP", savings: "You save AED 20", description: "Free shipping on your next order.", discount: 20 },
  { id: 5, code: "BUNDLE30", savings: "You save AED 30", description: "Bundle 3 or more items and save AED 30.", discount: 30 },
];

export default function CouponsPopup({ cartValue, onApply, onClose }) {
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

  const handleApplyAction = async (coupon) => {
    // 1. Wait for Parent (OrderSummary) to confirm API success
    const isSuccess = await onApply?.(coupon);
    
    // 2. Only show "Applied ✓" if the API actually worked
    if (isSuccess === true) {
      setApplied(coupon.id);
      
      // Success celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C6A15B", "#414343"]
      });
    }
  };

  const content = (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onClose}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M5.654 11.3075L0 5.65375L5.654 0L6.70775 1.0845L2.8885 4.90375H15.404V6.40375H2.8885L6.70775 10.223L5.654 11.3075Z" fill="#414343" />
            </svg>
          </button>
          <div className={styles.upperText}>
            <h2 className={styles.title}>Coupons and Offers</h2>
            <p className={styles.cartValue}>Cart value : AED {cartValue?.toLocaleString()}</p>
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
              const match = couponsData.find(c => c.code.toLowerCase() === search.trim().toLowerCase());
              if (match) handleApplyAction(match);
            }}
          >
            Apply
          </button>
        </div>

        <p className={styles.offersLabel} style={{ marginBottom: "16px" }}>Available Offers</p>

        <ul className={styles.couponList}>
          {filtered.map((coupon) => (
            <li key={coupon.id} className={`${styles.couponCard} ${applied === coupon.id ? styles.couponApplied : ""}`}>
              <div className={styles.couponBody}>
                <div className={styles.couponLeft}>
                  <div className={styles.couponCodeRow}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M8.41229 5.27937L9.67904 5.32392L9.42833 12.5581L8.16158 12.5135L8.41229 5.27937ZM0.475307 8.62172L9.21526 0.407954C9.8216 -0.161876 10.7611 -0.128834 11.3265 0.482204L13.364 2.68415C13.0743 2.95645 12.9037 3.33359 12.8899 3.73261C12.8761 4.13163 13.0201 4.51984 13.2903 4.81184C13.5605 5.10383 13.9347 5.2757 14.3306 5.28962C14.7266 5.30355 15.1118 5.15839 15.4015 4.88609L17.439 7.08803C18.0045 7.69907 17.9716 8.64589 17.3653 9.21572L8.62535 17.4295C8.33561 17.7018 7.95039 17.8469 7.55446 17.833C7.15852 17.8191 6.78429 17.6472 6.5141 17.3552L4.47659 15.1533C5.08293 14.5835 5.11574 13.6366 4.55033 13.0256C4.28014 12.7336 3.90591 12.5617 3.50998 12.5478C3.11404 12.5339 2.72883 12.679 2.43908 12.9513L0.401568 10.7494C0.131377 10.4574 -0.0126455 10.0692 0.00118325 9.67018C0.0150119 9.27117 0.185559 8.89402 0.475307 8.62172ZM1.49406 9.72269L2.78788 11.1209C3.29831 11.0019 3.83085 11.0204 4.33192 11.1746C4.83299 11.3288 5.28491 11.6133 5.64222 11.9994C5.99953 12.3856 6.24963 12.8598 6.36734 13.3743C6.48505 13.8888 6.46623 14.4254 6.31278 14.9303L7.6066 16.3285L16.3466 8.11475L15.0527 6.71652C14.5423 6.83559 14.0098 6.81708 13.5087 6.66286C13.0076 6.50863 12.5557 6.22414 12.1984 5.83799C11.8411 5.45185 11.591 4.97767 11.4733 4.46317C11.3556 3.94868 11.3744 3.41201 11.5278 2.90716L10.234 1.50892L1.49406 9.72269ZM5.51718 8.00018C5.97056 7.57409 6.67783 7.59896 7.10062 8.05587C7.5234 8.51277 7.4987 9.22554 7.04531 9.65163C6.59193 10.0777 5.88466 10.0528 5.46187 9.59595C5.03909 9.13904 5.06379 8.42627 5.51718 8.00018ZM10.7953 8.1858C11.2487 7.75971 11.956 7.78459 12.3787 8.24149C12.8015 8.69839 12.7768 9.41117 12.3234 9.83726C11.8701 10.2633 11.1628 10.2385 10.74 9.78157C10.3172 9.32467 10.3419 8.61189 10.7953 8.1858Z" fill="#414343"/>
                    </svg>
                    <span className={styles.couponCode}>{coupon.code}</span>
                  </div>
                  <div className={styles.couponDesc}>
                    <p className={styles.savings}>{coupon.savings}</p>
                    <p className={styles.description}>{coupon.description}</p>
                  </div>
                  <button className={styles.knowMore} onClick={() => setExpanded(expanded === coupon.id ? null : coupon.id)}>
                    {expanded === coupon.id ? "Show less" : "Know more"}
                  </button>
                  {expanded === coupon.id && (
                    <div className={styles.expandedText}>
                      <li>Discount will be applied on checkout.</li>
                      <li>Valid on all specialty coffee items.</li>
                    </div>
                  )}
                </div>
                <button
                  className={`${styles.applyNowBtn} ${applied === coupon.id ? styles.appliedBtn : ""}`}
                  onClick={() => handleApplyAction(coupon)}
                  disabled={applied === coupon.id}
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