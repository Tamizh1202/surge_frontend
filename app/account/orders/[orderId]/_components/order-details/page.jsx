"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

export default function OrderDetails({ order }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!order) return null;

  const financials = order?.financials || {};
  const subtotal = Number(financials.subtotal || 0);
  const couponDiscount = Number(financials.couponDiscount || 0);
  const beansDiscount = Number(financials.surgeCoinsDiscount || financials.wtCoinsDiscount || 0);
  const shipping = Number(financials.shippingCharge ?? 0);
  const tax = Number(financials.taxAmount || 0);
  const taxPercentage = Number(financials.taxPercentage || 0);
  const total = Number(financials.total || 0);
  const savings = couponDiscount + beansDiscount;

  const paymentData = order.stripeData?.payment_method_details?.card || {};
  const paymentMethod = paymentData.brand
    ? `${paymentData.brand.toUpperCase()} •••• ${paymentData.last4}`
    : order.payment_method_title || order.paymentMethod || "Stripe Payment";

  const formatAED = (value) => `AED ${Number(value || 0).toFixed(2)}`;

  return (
    <div className={styles.main}>
      <h1>Order price</h1>
      <div className={styles.container}>
        <div className={styles.Top} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
         
          <div className={styles.Left}>
            <h1>{formatAED(total)}</h1>
            {savings > 0 && (
              <p className={styles.savingsBadge}>You saved {formatAED(savings)}</p>
            )}
          </div>

          <div className={`${styles.toggleIcon} ${isOpen ? styles.open : ""}`}>
            <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.44336 9.75L16.8871 0H-0.000388145L8.44336 9.75Z" fill="#6E736A" />
            </svg>
          </div>
        </div>
 <div className={styles.divider}></div>
        <div className={`${styles.detailsWrapper} ${isOpen ? styles.open : ""}`}>
          <div className={styles.detailsContent}>
            <div className={styles.detailRow}>
              <span>Subtotal</span>
              <span>{formatAED(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className={styles.detailRow}>
                <span>Coupon Discount</span>
                <span className={styles.discountText}>- {formatAED(couponDiscount)}</span>
              </div>
            )}
            {beansDiscount > 0 && (
              <div className={styles.detailRow}>
                <span>Beans Discount</span>
                <span className={styles.discountText}>- {formatAED(beansDiscount)}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatAED(shipping)}</span>
            </div>
            {tax > 0 && (
              <div className={styles.detailRow}>
                <span>Tax{taxPercentage ? ` (${taxPercentage}%)` : ""}</span>
                <span>{formatAED(tax)}</span>
              </div>
            )}
            <div className={styles.dividerSub}></div>
            <div className={`${styles.detailRow} ${styles.totalRow}`}>
              <span>Order total</span>
              <span>{formatAED(total)}</span>
            </div>
          </div>
        </div>

        <div className={styles.paymentMethod}>
          <div className={styles.paymentLeft}>
            <p>Payment method</p>
          </div>
          <div className={styles.paymentRight}>
            <span>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9818 0H1.01818C0.748143 0 0.489165 0.113461 0.298219 0.315424C0.107272 0.517386 0 0.791305 0 1.07692V10.9231C0 11.2087 0.107272 11.4826 0.298219 11.6846C0.489165 11.8865 0.748143 12 1.01818 12H14.9818C15.2519 12 15.5108 11.8865 15.7018 11.6846C15.8927 11.4826 16 11.2087 16 10.9231V1.07692C16 0.791305 15.8927 0.517386 15.7018 0.315424C15.5108 0.113461 15.2519 0 14.9818 0ZM1.01818 0.923077H14.9818C15.0204 0.923077 15.0574 0.939286 15.0847 0.968137C15.1119 0.996989 15.1273 1.03612 15.1273 1.07692V3.07692H0.872727V1.07692C0.872727 1.03612 0.888052 0.996989 0.91533 0.968137C0.942608 0.939286 0.979605 0.923077 1.01818 0.923077ZM14.9818 11.0769H1.01818C0.979605 11.0769 0.942608 11.0607 0.91533 11.0319C0.888052 11.003 0.872727 10.9639 0.872727 10.9231V4H15.1273V10.9231C15.1273 10.9639 15.1119 11.003 15.0847 11.0319C15.0574 11.0607 15.0204 11.0769 14.9818 11.0769ZM13.6727 9.07692C13.6727 9.19933 13.6268 9.31673 13.5449 9.40328C13.4631 9.48984 13.3521 9.53846 13.2364 9.53846H10.9091C10.7934 9.53846 10.6824 9.48984 10.6005 9.40328C10.5187 9.31673 10.4727 9.19933 10.4727 9.07692C10.4727 8.95452 10.5187 8.83712 10.6005 8.75057C10.6824 8.66401 10.7934 8.61539 10.9091 8.61539H13.2364C13.3521 8.61539 13.4631 8.66401 13.5449 8.75057C13.6268 8.83712 13.6727 8.95452 13.6727 9.07692ZM9.01818 9.07692C9.01818 9.19933 8.97221 9.31673 8.89037 9.40328C8.80854 9.48984 8.69755 9.53846 8.58182 9.53846H7.41818C7.30245 9.53846 7.19146 9.48984 7.10963 9.40328C7.02779 9.31673 6.98182 9.19933 6.98182 9.07692C6.98182 8.95452 7.02779 8.83712 7.10963 8.75057C7.19146 8.66401 7.30245 8.61539 7.41818 8.61539H8.58182C8.69755 8.61539 8.80854 8.66401 8.89037 8.75057C8.97221 8.83712 9.01818 8.95452 9.01818 9.07692Z" fill="#6E736A" />
              </svg>
            </span>
            <p>{paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
