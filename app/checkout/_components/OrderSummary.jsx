"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "../page.module.css";
import CouponsPopup from "../CouponPopup/coupanPopup";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/_context/CartContext";
import { formatImageUrl } from "@/lib/imageUtils";

const placeholderImage = "/1.png";

export default function OrderSummary({
  product,
  cartTotals,
  delivery,
  checkoutMode,
  isProcessing,
  handlePayment,
  isAddressSelected,
}) {
  const {
    isBeansApplied,
    toggleBeans,
    beansBalance,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCart();

  const { status } = useSession();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

  const handleApplyCoupon = async () => {
    setCouponError("");
    const res = await applyCoupon(couponInput);
    if (!res.ok) setCouponError(res.message);
    else setCouponInput("");
  };

  const handlePopupApply = async (coupon) => {
    setCouponError("");
    const res = await applyCoupon(coupon.code);
    if (res.ok) {
      setCouponInput("");
      setTimeout(() => setShowCoupons(false), 1500);
      return true;
    } else {
      setCouponError(res.message);
      return false;
    }
  };

  return (
    <div className={styles.Right}>
      <div className={styles.RightOne}>
        <h3>Order Summary</h3>
        <p>({product.length} items)</p>
      </div>

      <div className={styles.RightTwo} data-lenis-prevent style={{ overflowY: "auto" }}>
        {product.map((item, idx) => {
          const isSubscription = checkoutMode === "subscription";
          
          const selections = item.customSelections || {};
          const displaySelections = Object.entries(selections)
            .filter(([, value]) => String(value).trim() !== "");
          
          const metaText = [item.tagline, ...displaySelections.map(([, value]) => value)]
            .filter(Boolean)
            .join(", ");

          return (
            <div className={`${styles.SummaryItem} ${isSubscription ? styles.SubSummaryItem : ""}`} key={item.id || idx}>
              <div className={styles.ItemImage}>
                <Image src={formatImageUrl(item.image) || placeholderImage} alt={item.name} width={92} height={92} />
              </div>
              <div className={styles.ItemInfo} style={{ display: 'flex', flexDirection: 'column',  }}>
                {/* Line 1: Name and Weight (Brazil Santa Ines, 250g) */}
                <div className={styles.ItemMainRow} style={{ display: 'flex', alignItems: 'center',  }}>
                  <div className={styles.ItemName} style={{ fontSize: '16px', fontWeight: '400', color: '#414343' }}>
                    {item.name}{item.weight ? `, ${item.weight}g` : item.variantName ? `, ${item.variantName}g` : ''}
                  </div>
                </div>
                
                {/* Line 2: Metadata (Expresso Roast, Whole bean, Whole) */}
                {metaText && (
                  <div style={{ fontSize: "12px", color: "#8E9191", lineHeight: '1.2' }}>
                    {metaText}
                  </div>
                )}

                {/* Line 3: Quantity (2X) */}
                <div style={{ fontSize: '16px', color: '#414343', marginTop: '8px' }}>
                  {item.quantity}<span style={{ fontSize: '16px', color: '#414343' }}>x</span>
                </div>
              </div>
              
              {!isSubscription && (
                <div className={styles.ItemPrice}>
                  AED {(parseFloat(item.price?.final_price || item.price) || 0).toFixed(0)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rest of the component remains the same */}
      <div className={styles.CouponSection}>
        <div className={styles.CouponHeader}>
          <h3>Coupons and Offers</h3>
          {checkoutMode !== "subscription" && !appliedCoupon && status === "authenticated" && (
            <div className={styles.ViewAll} onClick={() => setShowCoupons(true)}>
              <span>View all coupons</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 9L5 5L1 1" stroke="#c87941" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {!appliedCoupon ? (
          <div className={styles.CouponInputGroup}>
            <input 
              type="text" 
              placeholder="Enter Coupon Code" 
              value={couponInput} 
              onChange={(e) => setCouponInput(e.target.value)} 
            />  
            <button onClick={handleApplyCoupon} disabled={status !== "authenticated"}>Apply</button>
          </div>
        ) : (
          <div className={styles.AppliedCouponGroup}>
            <p className={styles.AppliedText}>{appliedCoupon.code} applied!</p>
            <div className={styles.AppliedRight}>
              <div className={styles.SavingsBadge}>You saved AED {Number(appliedCoupon.discount || 0).toFixed(0)}</div>
              <button className={styles.RemoveCouponBtn} onClick={removeCoupon}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#2F362A" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className={styles.RewardsSection}>
          <label className={`${styles.CheckboxContainer} ${beansBalance <= 0 ? styles.Disabled : ""}`}>
            <input type="checkbox" checked={isBeansApplied} onChange={toggleBeans} disabled={beansBalance <= 0 || status !== "authenticated"} />
            <span className={styles.Checkmark}></span>
            <div className={styles.RewardsInfo}>
              <p className={styles.RewardsLabel}>Use Surge Beans</p>
              <p className={styles.RewardsBalance}>Total Beans: {beansBalance}</p>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.RightThree}>
        {couponError && <p className={styles.CheckoutCouponError} style={{ color: "red", fontSize: "12px" }}>{couponError}</p>}
        <div className={styles.Subtotal}>
          <p>Subtotal</p>
          <h5>AED {Number(cartTotals.subtotal || 0).toFixed(2)}</h5>
        </div>
        {cartTotals.discount > 0 && (
          <div className={styles.Subtotal}>
            <p>Coupon Discount</p>
            <h5 style={{ color: "green" }}>- AED {Number(cartTotals.discount || 0).toFixed(2)}</h5>
          </div>
        )}
        {isBeansApplied && cartTotals.beansDiscount > 0 && (
          <div className={styles.Subtotal}>
            <p>Beans Discount</p>
            <h5 style={{ color: "green" }}>- AED {Number(cartTotals.beansDiscount || 0).toFixed(2)}</h5>
          </div>
        )}
        <div className={styles.Subtotal}>
          <p>Shipping</p>
          <h5>{cartTotals.shipping === 0 ? "Free" : `AED ${Number(cartTotals.shipping || 0).toFixed(2)}`}</h5>
        </div>
        <div className={styles.Subtotal}>
          <p>Tax ({cartTotals.taxPercent || 5}%)</p>
          <h5>AED {Number(cartTotals.tax || 0).toFixed(2)}</h5>
        </div>
        <div className={styles.Total}>
          <p>Total</p>
          <h5>AED {Number(cartTotals.total || 0).toFixed(2)}</h5>
        </div>
      </div>

      {showCoupons && (
        <CouponsPopup
          cartValue={cartTotals.subtotal}
          onApply={handlePopupApply}
          onClose={() => setShowCoupons(false)}
        />
      )}

      <button className={`${styles.Pay} ${styles.MobilePay}`} onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
}