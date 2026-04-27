"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import axiosClient from "@/lib/axios";

export default function OrderSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const token = searchParams.get('token');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const config = token ? { headers: { 'x-guest-token': token } } : {};
        const res = await axiosClient.get(`/api/web-orders/${orderId}`, config);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) return <div className={styles.Wrapper}><p>Loading order details...</p></div>;
  if (error) return <div className={styles.Wrapper}><p>{error}</p></div>;
  if (!order) return null;

  const formatAddress = (addr) => {
    if (!addr) return "N/A";
    return `${addr.addressLine1 || ""} ${addr.addressLine2 || ""} ${addr.city || ""} ${addr.emirates || ""} ${addr.addressCountry || ""}`.trim();
  };

  const paymentData = order.stripeData?.payment_method_details?.card || {};
  const paymentMethodStr = paymentData.brand
    ? `${paymentData.brand.toUpperCase()} •••• ${paymentData.last4}`
    : "Stripe Payment";

  const rows = [
    { label: 'Order Id', value: order.id || orderId },
    { label: 'Payment Method', value: paymentMethodStr, icon: true },
    { label: 'Billing Address', value: formatAddress(order.billingAddress) },
    { label: 'Shipping Address', value: formatAddress(order.shippingAddress || order.billingAddress) },
    { label: 'Contact Information', value: order.email, fullWidth: true },
  ];

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Heading}>
        <span className={styles.CheckIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="var(--green)" />
            <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className={styles.ThankYou}>Thankyou for your purchase!</h2>
      </div>

      <div className={styles.ConfirmBanner}>
        <h3 className={styles.ConfirmTitle}>Your order is confirmed.</h3>
        <p className={styles.ConfirmSub}>
          Your payment was successful, and a confirmation email is on its way.
        </p>
      </div>

      <div className={styles.DetailCard}>
        <p className={styles.DetailCardLabel}>Order details</p>
        <div className={styles.DetailGrid}>
          {rows.filter(r => !r.fullWidth).map((row, idx) => (
            <div key={idx} className={styles.DetailCell}>
              <p className={styles.CellLabel}>{row.label}</p>
              <div className={styles.CellValue}>
                {row.icon && (
                  <svg className={styles.CardIcon} width="18" height="13" viewBox="0 0 18 13" fill="none">
                    <rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="#818686" />
                    <rect x="0" y="3" width="18" height="2.5" fill="#818686" />
                  </svg>
                )}
                <span>{row.value}</span>
              </div>
            </div>
          ))}
        </div>
        {rows.filter(r => r.fullWidth).map((row, idx) => (
          <div key={idx} className={`${styles.DetailCell} ${styles.FullWidth}`}>
            <p className={styles.CellLabel}>{row.label}</p>
            <div className={styles.CellValue}>
              <span>{row.value}</span>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.ContinueBtn} onClick={() => router.push('/')}>
        Continue Shopping
      </button>
    </div>
  );
}