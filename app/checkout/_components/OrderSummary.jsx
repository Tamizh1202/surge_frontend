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
    openCouponModal,
    isBeansApplied,
    toggleBeans,
    beansBalance,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    coinConfig,
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

  return (
    <div className={styles.Right}>
      <div className={styles.RightOne}>
        <h3>Order Summary</h3>
        <p>({product.length} items)</p>
      </div>

      <div className={styles.RightTwo} data-lenis-prevent style={{ overflowY: "auto" }}>
        {product.map((item, idx) => {
          const isSubscription = checkoutMode === "subscription";
          return (
            <div
              className={`${styles.SummaryItem} ${isSubscription ? styles.SubSummaryItem : ""}`}
              key={item.id || idx}
            >
              <div className={styles.ItemImage}>
                <Image
                  src={formatImageUrl(item.image) || placeholderImage}
                  alt={item.title || item.name}
                  width={92}
                  height={92}
                />
              </div>
              <div className={styles.ItemInfo}>
                <div className={styles.ItemMainRow}>
                  <div className={styles.ItemName}>{item.name} , {item.tagline}</div>
                  <div className={styles.ItemName}>{item.weight}</div>

                  {isSubscription && (
                    <div className={styles.ItemPrice}>
                      AED {(parseFloat(item.price?.final_price || item.price) || 0).toFixed(0)}
                    </div>
                  )}

                </div>
                <div className={styles.ItemQty}>×{item.quantity}</div>
                {isSubscription ? (
                  <>
                    <div className={styles.ItemSubRow}>
                      {item?.vId && <span>{item?.variantName}g</span>}
                      {item?.vId && <span>&nbsp;|&nbsp;</span>}
                      <span>{item.quantity}x Bag amount</span>
                    </div>
                    {item?.frequency && (
                      <div className={styles.ItemFrequencyRow}>{item.frequency}</div>
                    )}
                  </>
                ) : (
                  <>
                    {item?.vId && <span>{item?.variantName}g</span>}
                    {item?.frequency && (
                      <div className={styles.ItemFrequency} style={{ fontSize: "12px", color: "#6e736a" }}>
                        {item.frequency}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!isSubscription && (
                <>

                  <div className={styles.ItemPrice}>
                    AED {(parseFloat(item.price?.final_price || item.price) || 0).toFixed(0)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.CouponSection}>
        <div className={styles.CouponHeader}>
          <h3>Coupons and Offers</h3>
          {checkoutMode !== "subscription" && !appliedCoupon && status === "authenticated" && (
            <div className={styles.ViewAll} onClick={() => setShowCoupons(true)}>
              <span>View all coupons</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="#6E736A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {checkoutMode !== "subscription" && (!appliedCoupon ? (
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
              <div className={styles.SavingsBadge}>
                You saved AED {Number(appliedCoupon.discount || 0).toFixed(0)}
              </div>
              <button className={styles.RemoveCouponBtn} onClick={removeCoupon}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#2F362A" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <div className={`${styles.RewardsSection} ${checkoutMode === "subscription" ? styles.SubRewardsSection : ""}`}>
          <label
            className={`${styles.CheckboxContainer} ${beansBalance <= 0 ? styles.Disabled : ""}`}
            title={beansBalance <= 0 ? "You don't have enough WM beans to use for this order." : ""}
          >
            <input
              type="checkbox"
              checked={isBeansApplied}
              onChange={toggleBeans}
              disabled={beansBalance <= 0 || status !== "authenticated"}
            />
            <span className={styles.Checkmark}></span>
            <div className={styles.RewardsInfo}>
              <p className={styles.RewardsLabel}>Use Surge Beans</p>
              <p className={styles.RewardsBalance}>Total Beans: {beansBalance}</p>
            </div>
          </label>
          {status === "authenticated" ? (
            beansBalance > 0 && (() => {
              const pointsToAed = coinConfig?.pointsToAed || 10;
              const beansToUse = Math.min(
                Math.floor(cartTotals.subtotal * 0.2 * pointsToAed),
                beansBalance,
              );
              const savingAed = (beansToUse / pointsToAed).toFixed(2);
              return (
                <p className={styles.PotentialSavings}>
                  <span>{beansToUse} Beans will be used · Save AED {savingAed}</span>
                </p>
              );
            })()
          ) : (
            <span style={{
              color: "var(--green)",
              fontSize: "12px",
              fontFamily: "var(--lato)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              Login to use beans
            </span>
          )}
        </div>
      </div>

      <div className={styles.RightThree}>
        {couponError && <p className={styles.CheckoutCouponError}>{couponError}</p>}
        <div className={styles.Subtotal}>
          <p>Subtotal</p>
          <h5>AED {Number(cartTotals.subtotal || 0).toFixed(2)}</h5>
        </div>

        {cartTotals.discount > 0 && (
          <div className={styles.Subtotal}>
            <p>Discount</p>
            <h5 style={{ color: "green" }}>- AED {Number(cartTotals.discount || 0).toFixed(2)}</h5>
          </div>
        )}

        {cartTotals.beansDiscount > 0 && (
          <div className={styles.Subtotal}>
            <p>Beans Discount</p>
            <h5 style={{ color: "green" }}>- AED {Number(cartTotals.beansDiscount || 0).toFixed(2)}</h5>
          </div>
        )}

        <div className={styles.Shipping}>
          <p>Shipping</p>
          <h5>
            {cartTotals.shipping === 0
              ? delivery === "pickup"
                ? "Free (Pickup)"
                : checkoutMode === "subscription"
                  ? "Free"
                  : isAddressSelected
                    ? "Free"
                    : "Calculated at next step"
              : `AED ${Number(cartTotals.shipping || 0).toFixed(2)}`}
          </h5>
        </div>

        <div className={styles.EstimatedTax}>
          <p>Estimated Taxes ({cartTotals.taxPercent || 0}%)</p>
          <h5>AED {Number(cartTotals.tax || 0).toFixed(2)}</h5>
        </div>

        <div className={styles.Total}>
          <p>Total</p>
          <h5>AED {Number(cartTotals.total || 0).toFixed(2)}</h5>

          
        </div>

        <div className={styles.EarningBadge}>
          {status === "authenticated" ? (
            <p>You're earning {Math.floor(cartTotals.total * (coinConfig.pointsEarn / 100))} Beans on this order</p>
          ) : (
            <p style={{ color: "var(--green)"}}>Login to earn beans on this order</p>
          )}
        </div>
      </div>
      {showCoupons && (
        <CouponsPopup
          // cartValue={orderMeta.subtotal}
          onApply={(coupon) => {
            console.log("Applied:", coupon);
            setShowCoupons(false);
          }}
          onClose={() => setShowCoupons(false)}
        />
      )}
      <button
        className={`${styles.Pay} ${styles.MobilePay}`}
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
}