"use client";
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { formatImageUrl } from "@/lib/imageUtils";
import { useCart } from "@/app/_context/CartContext";
import PageLoader from "@/components/PageLoader/PageLoader";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const token = searchParams.get('token');

  const { clearCart, closeCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedSelections, setStoredSelections] = useState([]);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    // Load per-item customization data saved by CheckoutForm before payment
    try {
      const stored = JSON.parse(localStorage.getItem("orderCustomSelections") || "{}");
      setStoredSelections(stored[orderId] || []);
    } catch (e) { }

    const fetchOrder = async () => {
      try {
        const url = `/api/orders/${orderId}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setOrder(data);
        closeCart();
        await clearCart();
      } catch (err) {
        console.error("Failed to fetch order", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  // Expand backend-merged items back into separate display rows.
  // The backend merges items with the same productId+variantId into one row (qty N),
  // but CheckoutForm saved each item's customization separately before payment.
  const displayItems = useMemo(() => {
    if (!order?.items) return [];

    // Build a queue of stored customizations keyed by "productId__variantId"
    const queues = {};
    storedSelections.forEach(({ productId, variantId, customization, quantity, image }) => {
      const key = `${productId}__${variantId || ""}`;
      if (!queues[key]) queues[key] = [];
      queues[key].push({ customization, quantity: quantity || 1, image: image || "" });
    });

    const result = [];
    order.items.forEach((item) => {
      const pid = typeof item.product === 'object'
        ? (item.product?.id || '')
        : (item.product || '');
      const vid = item.variantID || item.vId || item.variantId || '';
      const key = `${pid}__${vid}`;
      const queue = queues[key];

      if (queue && queue.length > 1) {
        const totalStoredQty = queue.reduce((s, q) => s + q.quantity, 0);
        const serverQty = Number(item.quantity);
        if (serverQty >= totalStoredQty) {
          // Backend merged these — expand each customization into its own row
          queue.forEach(({ customization, quantity, image }) => {
            result.push({ ...item, quantity, _customization: customization, _image: image });
          });
          const remainder = serverQty - totalStoredQty;
          if (remainder > 0) {
            result.push({ ...item, quantity: remainder, _customization: '' });
          }
          queues[key] = [];
          return;
        }
      }

      // Item was not merged (or no stored data) — use queue entry if available
      const first = queue?.shift();
      result.push({ ...item, _customization: first?.customization || '', _image: first?.image || '' });
    });

    return result;
  }, [order, storedSelections]);

  if (loading) return <PageLoader />;
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

  const isPickup = order.deliveryOption === 'pickup';

  const formatPickupLocation = (shop) => {
    if (!shop || typeof shop !== 'object') return 'Pickup at store';
    const { street, city, emirates } = shop.address || {};
    const emirateLabel = emirates
      ? emirates.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : '';
    return [street, city, emirateLabel, 'UAE'].filter(Boolean).join(', ');
  };

  const rows = [
    { label: 'Order Id', value: order.id || orderId },
    { label: 'Payment Method', value: paymentMethodStr, icon: true },
    { label: 'Billing Address', value: formatAddress(order.billingAddress) },
    isPickup
      ? { label: 'Pickup Location', value: formatPickupLocation(order.pickupShop) }
      : { label: 'Shipping Address', value: formatAddress(order.shippingAddress || order.billingAddress) },
    { label: 'Contact Information', value: order.email, fullWidth: true },
  ];

  return (
    <div className={styles.Wrapper}>
      <div className={styles.SuccessLayout}>

        {/* LEFT */}
        <div className={styles.LeftSide}>
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

        {/* RIGHT */}
        <div className={styles.RightSide}>
          <div className={styles.SummaryBox}>
            <div className={styles.SummaryHeader}>
              <h3>Order Summary</h3>
              <p>({displayItems.length} items)</p>
            </div>

            <div className={styles.SummaryItems}>
              {displayItems.map((item, idx) => {
                const productName = item.product?.name || item.name || "Coffee Product";
                const variantName = item.product?.variants?.find(v => v.id === item.variantID)?.variantName || item.variantName || "";

                const variantForImage = item.product?.variants?.find(
                  v => v.id === (item.variantID || item.vId || item.variantId)
                );
                const imgUrl = formatImageUrl(item._image)
                  || formatImageUrl(variantForImage?.variantImage || item.product?.productImage || item.image)
                  || '/1.png';
                const itemPrice = Number(item.unitPrice ?? item.price ?? 0);

                // _customization is set by the expansion logic above (per-item highlight text).
                // Fall back to backend's stored customSelections if no expansion occurred.
                const backendSelections = item.customSelections || item.product?.customSelections || {};
                const backendSelectionText = Object.values(backendSelections)
                  .filter((v) => v && String(v).trim() !== "")
                  .join(", ");

                const finalTagline = item.tagline || item.product?.tagline || "";
                const selectionText = item._customization || backendSelectionText;
                const metaText = [finalTagline, selectionText]
                  .filter(Boolean)
                  .join(", ");


                return (
                  <div className={styles.SummaryItem} key={idx} style={{ alignItems: 'flex-start' }}>
                    <div className={styles.SummaryItemImg}>
                      <Image
                        src={imgUrl}
                        alt={productName}
                        width={92}
                        height={92}
                      />
                    </div>
                    <div className={styles.SummaryItemInfo} style={{ display: 'flex', flexDirection: 'column', }}>
                      <p className={styles.SummaryItemName} style={{ margin: 0, fontSize: 'var(--fs-18)', color: '#414343' }}>
                        {productName}
                        {variantName && <span>, {variantName}g</span>}
                      </p>

                      {/* Line 2: Added Metadata configuration rendering matching OrderSummary */}
                      {metaText && (
                        <div style={{ fontSize: "var(--fs-16)", fontWeight: '500', color: "#818686", margin: '6px 0 0 0', lineHeight: '1.2', fontFamily: 'Raleway' }}>
                          {metaText}
                        </div>
                      )}

                      <span style={{ marginTop: '16px', fontSize: "var(--fs-18)", fontWeight: '400', color: "#414343" }}>{item.quantity}x</span>
                    </div>
                    <p className={styles.SummaryItemPrice}>
                      AED {itemPrice.toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className={styles.SummaryTotals}>
              {(() => {
                const f = order.financials || {};
                const subtotal = Number(f.subtotal || 0);
                const couponDiscount = Number(f.couponDiscount || 0);
                const shipping = Number(f.shippingCharge ?? 0);
                const tax = Number(f.taxAmount || 0);
                const total = Number(f.total || 0);
                const beansDiscount = Number(f.surgeCoinsDiscount || 0);

                return (
                  <>
                    <div className={styles.TotalRow}>
                      <p>Subtotal</p>
                      <p>AED {subtotal.toFixed(2)}</p>
                    </div>
                    {couponDiscount > 0 && (
                      <div className={styles.TotalRow}>
                        <p>Coupon Discount</p>
                        <p style={{ color: 'green' }}>- AED {couponDiscount.toFixed(2)}</p>
                      </div>
                    )}
                    {beansDiscount > 0 && (
                      <div className={styles.TotalRow}>
                        <p>Beans Discount</p>
                        <p style={{ color: 'green' }}>- AED {beansDiscount.toFixed(2)}</p>
                      </div>
                    )}
                    <div className={styles.TotalRow}>
                      <p>Shipping</p>
                      <p>{shipping === 0 ? 'Free' : `AED ${shipping.toFixed(2)}`}</p>
                    </div>
                    {tax > 0 && (
                      <div className={styles.TotalRow}>
                        <p>Tax</p>
                        <p>AED {tax.toFixed(2)}</p>
                      </div>
                    )}
                    <div className={`${styles.TotalRow} ${styles.GrandTotal}`}>
                      <p>Total</p>
                      <p>AED {total.toFixed(2)}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
