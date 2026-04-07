"use client";
import { useState } from "react";
import styles from "../Checkout.module.css";
import { products, coupons, orderMeta } from "../data/data";
import CouponsPopup from "../CouponPopup/coupanPopup"

export default function OrderSummary() {
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupons, setAppliedCoupons] = useState({});
    const [showCoupons, setShowCoupons] = useState(false);

    const totalItems = products.reduce((acc, p) => acc + p.qty, 0);

    const toggleCoupon = (id) =>
        setAppliedCoupons((prev) => ({ ...prev, [id]: !prev[id] }));

    const activeCouponDiscount = coupons
        .filter((c) => appliedCoupons[c.id])
        .reduce((acc, c) => acc + c.discount, 0);

    const dynamicTotal =
        orderMeta.subtotal +
        orderMeta.shipping -
        activeCouponDiscount +
        orderMeta.estimatedTaxes;

    return (
        <>  {/* ✅ fragment so popup can be a sibling */}
            <div className={styles.orderSummaryCard}>
                <h2 className={styles.summaryHeader}>
                    Order Summary
                    <span className={styles.summaryItemCount}>({totalItems} items)</span>
                </h2>

                <ul className={styles.productList}>
                    {products.map((product) => (
                        <li key={product.id} className={styles.productItem}>
                            <div className={styles.productImgWrap}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.productImg}
                                    onError={(e) => {
                                        e.target.style.background = "#e8e0d8";
                                        e.target.src = "";
                                    }}
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <div>
                                    <p className={styles.productName}>{product.name}</p>
                                    <p className={styles.productQtyLine}>x{product.qty}</p>
                                </div>
                                <span className={styles.productPrice}>
                                    AED {product.price.toLocaleString()}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>

                <hr className={styles.divider} />

                <div className={styles.couponsSection}>
                    <div className={styles.couponsHeaderRow}>
                        <span className={styles.couponsTitle}>Coupons and Offers</span>
                        <button onClick={() => setShowCoupons(true)} className={styles.viewCouponsLink}>
                            View Coupons ›
                        </button>
                    </div>

                    <div className={styles.couponInputRow}>
                        <input
                            type="text"
                            className={styles.couponInput}
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className={styles.applyBtn}>Apply</button>
                    </div>

                    {coupons.map((coupon) => (
                        <div key={coupon.id} className={styles.couponOptionRow}>
                            <input
                                type="checkbox"
                                id={`coupon-${coupon.id}`}
                                checked={!!appliedCoupons[coupon.id]}
                                onChange={() => toggleCoupon(coupon.id)}
                            />
                            <label htmlFor={`coupon-${coupon.id}`}>
                                <p className={styles.couponLabel}>{coupon.label}</p>
                                <p className={styles.couponSub}>{coupon.sub}</p>
                                <p className={styles.couponSavings}>{coupon.savings}</p>
                            </label>
                        </div>
                    ))}
                </div>

                <hr className={styles.divider} />

                <div className={styles.totalsBlock}>
                    <div className={styles.totalRow}>
                        <span className={styles.label}>Subtotal</span>
                        <span className={styles.value}>AED {orderMeta.subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span className={styles.label}>Shipping</span>
                        <span className={styles.value}>AED {orderMeta.shipping.toLocaleString()}</span>
                    </div>
                    {activeCouponDiscount > 0 && (
                        <div className={`${styles.totalRow} ${styles.discount}`}>
                            <span className={styles.label}>Coupon Discount</span>
                            <span className={styles.value}>− AED {activeCouponDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className={styles.totalRow}>
                        <span className={styles.label}>Estimated Taxes</span>
                        <span className={styles.value}>AED {orderMeta.estimatedTaxes.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                        <span className={styles.label}>Total</span>
                        <span className={styles.value}>
                            AED {dynamicTotal.toLocaleString("en", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <p className={styles.savingsNote}>{orderMeta.savingsNote}</p>
            </div>

            {/* ✅ Outside the card so backdrop covers full screen */}
            {showCoupons && (
                <CouponsPopup
                    cartValue={orderMeta.subtotal}
                    onApply={(coupon) => {
                        console.log("Applied:", coupon);
                        setShowCoupons(false);
                    }}
                    onClose={() => setShowCoupons(false)}
                />
            )}
        </>
    );
}