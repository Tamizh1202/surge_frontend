"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./OrderCard.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

const OrderCard = ({ order, handleCancelButton }) => {
  if (!order) return null;
  const router = useRouter();
  
  const config = getStatusConfig(order.deliveryStatus || order.status, order);
  const items = order.docs || order.items || order.line_items || [];
  const visibleItems = items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  return (
    <div className={styles.orderCard}>
      {/* HEADER SECTION */}
      <div className={styles.cardHeader}>
        <div className={styles.statusGroup}>
          <div className={styles.iconWrapper}>{config.icon}</div>
          <div className={styles.statusTexts}>
            <h3 style={{ color: config.color }}>{config.label}</h3>
            <p>{config.date}</p>
          </div>
        </div>
        <div className={styles.metaGroup}>
          <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
          <p>Order ID: <span>#{order.id}</span></p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* INSET BOX FOR ITEMS */}
      <div className={styles.itemsBox}>
        <div className={styles.itemsBoxHeader}>
          <span>{items.length} Items</span>
          <div className={styles.detailsLink} onClick={() => router.push(`/account/orders/${order.id}`)}>
            Order details 
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L5 5L1 1" stroke="#6E736A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.productList}>
          {visibleItems.map((item, idx) => (
            <div key={idx} className={styles.productRow}>
              <div className={styles.imageContainer}>
                <Image
                  src={formatImageUrl(item.productImage?.url || item.product?.productImage?.url) || "/order.png"}
                  alt="Coffee"
                  width={60}
                  height={60}
                />
              </div>
              <div className={styles.productDetails}>
                <h4>{item.product?.name || item.name}</h4>
                <p>{item.product?.variants?.[0]?.variantName || "1kg"}</p>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className={styles.moreText}>+ {remainingCount} more</p>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      {config.showCancel && (
        <div className={styles.cardFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={() => handleCancelButton(order.id)}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;