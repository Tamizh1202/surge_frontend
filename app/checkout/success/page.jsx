"use client";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// ─────────────────────────────────────────────────────────────
// Mock order data — swap this out with your real API response
// ─────────────────────────────────────────────────────────────
const ORDER_DATA = {
  id: '2864297643',
  paymentMethod: {
    brand: 'Visa',
    last4: '6494',
  },
  billingAddress: {
    line1: 'Office 1502, Jumeirah Business Centre 1',
    line2: 'Jumeirah Lakes Towers (JLT), Cluster G',
    city: 'Dubai',
    zip: '450123',
  },
  shippingAddress: {
    line1: 'Office 1502, Jumeirah Business Centre 1',
    line2: 'Jumeirah Lakes Towers (JLT), Cluster G',
    city: 'Dubai',
    zip: '450123',
  },
  contactEmail: 'ahmed.almansouri@email.com',
};

// ─────────────────────────────────────────────────────────────
// Detail grid rows — label / value pairs
// ─────────────────────────────────────────────────────────────
function buildDetailRows(order) {
  const formatAddress = (addr) =>
    `${addr.line1} ${addr.line2} ${addr.city} ${addr.zip}`;

  return [
    {
      id: 'orderId',
      label: 'Order Id',
      value: order.id,
    },
    {
      id: 'payment',
      label: 'Payment Method',
      value: `${order.paymentMethod.brand} ${order.paymentMethod.last4.padStart(16, '•').replace(/(.{4})/g, '$1 ').trim()}`,
      icon: true, // renders the card icon
    },
    {
      id: 'billing',
      label: 'Billing Address',
      value: formatAddress(order.billingAddress),
    },
    {
      id: 'shipping',
      label: 'Shipping Address',
      value: formatAddress(order.shippingAddress),
    },
    {
      id: 'contact',
      label: 'Contact Information',
      value: order.contactEmail,
      fullWidth: true,
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function OrderSuccess({ order = ORDER_DATA }) {
  const router = useRouter();
  const rows = buildDetailRows(order);

  // split into the 2-column grid rows + the full-width contact row
  const gridRows = rows.filter((r) => !r.fullWidth);
  const fullRows = rows.filter((r) => r.fullWidth);

  return (
    <div className={styles.Wrapper}>
      {/* ── Heading ── */}
      <div className={styles.Heading}>
        <span className={styles.CheckIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="var(--green)" />
            <path
              d="M5.5 10.5L8.5 13.5L14.5 7"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className={styles.ThankYou}>Thankyou for your purchase!</h2>
      </div>

      {/* ── Confirmation banner ── */}
      <div className={styles.ConfirmBanner}>
        <h3 className={styles.ConfirmTitle}>Your order is confirmed.</h3>
        <p className={styles.ConfirmSub}>
          Your payment was successful, and a confirmation email is on its way.
        </p>
      </div>

      {/* ── Order detail card ── */}
      <div className={styles.DetailCard}>
        <p className={styles.DetailCardLabel}>Order details</p>
        {/* 2-col grid pairs */}
        <div className={styles.DetailGrid}>
          {gridRows.map((row) => (
            <div key={row.id} className={styles.DetailCell}>
              <p className={styles.CellLabel}>{row.label}</p>
              <div className={styles.CellValue}>
                {row.icon && (
                  <svg
                    className={styles.CardIcon}
                    width="18"
                    height="13"
                    viewBox="0 0 18 13"
                    fill="none"
                  >
                    <rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="#818686" />
                    <rect x="0" y="3" width="18" height="2.5" fill="#818686" />
                  </svg>
                )}
                <span>{row.value}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Full-width rows */}
        {fullRows.map((row) => (
          <div key={row.id} className={`${styles.DetailCell} ${styles.FullWidth}`}>
            <p className={styles.CellLabel}>{row.label}</p>
            <div className={styles.CellValue}>
              <span>{row.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <button
        className={styles.ContinueBtn}
        onClick={() => router.push('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
}