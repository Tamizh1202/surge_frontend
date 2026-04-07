"use client";
import styles from "./Checkout.module.css"
import ContactForm from "./_components/ContactForm";
import Payment from "./_components/PaymentForm";
import BillingAddress from "./_components/BillingForm";
import OrderSummary from "./_components/OrderSummary";
export default function Checkout() {
  const handlePayNow = (e) => {
    e.preventDefault();
    alert("Processing payment…");
  };
  return (
    <div className={styles.checkoutRoot}>
      <div className={styles.checkoutInner}>
        <div className={styles.brandBar}>
          <span>Express Checkout</span>
        </div>
        <div className={styles.checkoutGrid}>
          {/* ── Left Column ── */}
          <div className={styles.leftCol}>
            <ContactForm />
            <Payment />
            <BillingAddress />
            <button className={styles.payNowBtn} onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
          {/* ── Right Column ── */}
          <div className={styles.rightCol}>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}