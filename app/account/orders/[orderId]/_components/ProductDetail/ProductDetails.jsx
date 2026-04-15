'use client';
import React from "react";
import Image from "next/image";
import styles from "./ProductDetails.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";

const ProductDetail = ({ order }) => {
  if (!order) return null;

  const config = getStatusConfig(order.deliveryStatus || order.status, order);
  const items = order.items || order.line_items || [];

  return (
    <div className={styles.orderCard}>
      {/* HEADER SECTION */}
      <div className={styles.orderTop}>
        <div className={styles.orderTopLeft}>
          <span className={styles.statusIcon}>{config.icon}</span>
          <div>
            <p className={styles.orderStatusTitle} style={{ color: config.color }}>
              {config.label}
            </p>
            <p className={styles.orderDateSub}>{config.date}</p>
          </div>
        </div>
        
        <div className={styles.orderTopRight}>
          <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
          <p>Order ID: <span>#{order.id}</span></p>
        </div>
      </div>

      {/* ITEMS SECTION */}
      <div className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}>
        <div className={styles.orderItems}>
          {items.map((item, idx) => {
            const itemImg = item.productImage?.url || item.product?.productImage?.url;
            const itemName = item.product?.name || item.name || "Coffee Product";
            
            // Logic to find weight/variant name
            const weight = item.product?.variants?.find(v => v.id === item.variantID)?.variantName 
                           || item.product?.weight;

            return (
              <div className={styles.orderItem} key={idx}>
                <Image
                  src={formatImageUrl(itemImg) || "https://placehold.co/100x100"}
                  alt={itemName}
                  width={80}
                  height={80}
                  className={styles.orderItemImg}
                />
                <div className={styles.orderItemInfo}>
                  <p className={styles.itemName}>
                    {itemName} {item.product?.tagline && `- ${item.product.tagline}`}
                  </p>
                  <div className={styles.itemMeta}>
                    {weight && (
                      <>
                        <span>{weight}{!isNaN(weight) ? 'kg' : ''}</span>
                        <span className={styles.Separator}>|</span>
                      </>
                    )}
                    <span>Qty: {item.quantity || "1"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SECTION: Rate This Order */}
      <div className={styles.rateOrderFooter}>
        <span className={styles.rateOrderText}>Rate This Order</span>
        <div className={styles.stars}>
          {/* Using Unicode stars for simplicity, replace with Icons if preferred */}
          {[...Array(5)].map((_, i) => (
            <span key={i}><svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.95118 13.3984L9.28162 11.5191L12.6121 13.4231L11.7398 9.86232L14.6738 7.48848L10.8147 7.16702L9.28162 3.80408L7.74856 7.14229L3.88948 7.46375L6.82344 9.86232L5.95118 13.3984ZM3.54586 16.5007L5.06069 10.3987L0 6.29587L6.67701 5.75384L9.28162 0L11.8862 5.75384L18.5632 6.29587L13.5026 10.3987L15.0174 16.5007L9.28162 13.2633L3.54586 16.5007Z" fill="white"/>
</svg>
</span>
          ))}
        </div>
      </div>

      {/* MOBILE METADATA */}
      <div className={`${styles.orderMobileMeta} ${config.noBottom ? styles.orderMobileMetaNoBorder : ""}`}>
        <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
        <p>Order ID: <span>#{order.id}</span></p>
      </div>
    </div>
  );
};

export default ProductDetail;