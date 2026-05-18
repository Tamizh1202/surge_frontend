"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";

function OrderSuccessContent() {
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
              <p>({order.items?.length || 0} items)</p>
            </div>

            <div className={styles.SummaryItems}>
              {order.items?.map((item, idx) => {
                const productName = item.product?.name || item.name || "Coffee Product";
                const variantName = item.product?.variants?.find(v => v.id === item.variantID)?.variantName || item.variantName || "";
                
                const imgUrl = formatImageUrl(
                  item.productImage?.url || item.product?.productImage?.url || item.image
                ) || '/1.png';
                
                const itemPrice = Number(item.unitPrice ?? item.price ?? 0);

            
                const selections = item.customSelections || item.product?.customSelections || {};
                const displaySelections = Object.entries(selections)
                  .filter(([, value]) => value && String(value).trim() !== "");
                
                // Fallback storage cross-check logic
                let backupMeta = null;
                try {
                  const stored = localStorage.getItem("surge_cart_meta");
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    const lookupKey = `${item.product?.id || item.product || ""}_${item.variantID || item.vId || ""}`;
                    backupMeta = parsed[lookupKey];
                  }
                } catch(e) { console.error(e); }

                const finalTagline = item.tagline || item.product?.tagline || backupMeta?.tagline || "";
                const selectionArray = displaySelections.length > 0 
                  ? displaySelections.map(([, value]) => value) 
                  : (backupMeta?.customSelections ? Object.values(backupMeta.customSelections) : []);

                const metaText = [finalTagline, ...selectionArray]
                  .filter(Boolean)
                  .join(", ");
            

                return (
                  <div className={styles.SummaryItem} key={idx} style={{ alignItems: 'flex-start' }}>
                    <div className={styles.SummaryItemImg}>
                      <img
                        src={imgUrl}
                        alt={productName}
                        width={92}
                        height={92}
                      />
                    </div>
                    <div className={styles.SummaryItemInfo} style={{ display: 'flex', flexDirection: 'column', }}>
                      <p className={styles.SummaryItemName} style={{ margin: 0, fontSize: '16px', color: '#414343' }}>
                        {productName}
                        {variantName && <span>, {variantName}g</span>}
                      </p>
                      
                      {/* Line 2: Added Metadata configuration rendering matching OrderSummary */}
                      {metaText && (
                        <div style={{ fontSize: "12px", fontWeight: '500', color: "#818686", margin: '4px 0 0 0', lineHeight: '1.2',fontFamily: 'Raleway' }}>
                          {metaText}
                        </div>
                      )}

                      <span style={{ marginTop: '16px',fontSize: "16px", fontWeight: '400', color: "#414343"}}>{item.quantity}x</span>
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
    <Suspense fallback={<div className={styles.Wrapper}><p>Loading...</p></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}