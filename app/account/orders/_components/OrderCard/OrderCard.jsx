"use client";
import React from "react";
import Image from "next/image";
import styles from "./OrderCard.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";

const OrderCard = ({ order, handleCancelButton }) => {
  if (!order) return null;
  const router = useRouter();

  const [rating, setRating] = useState(order.orderRating || 0);
  const [hover, setHover] = useState(0);

  const handleRating = async (score) => {
    const newRating = rating === score ? 0 : score;
    setRating(newRating);
    try {
      await axiosClient.patch(`/api/web-orders/${order.id}`, {
        orderRating: newRating,
      });
      if (newRating > 0) {
        toast.success(`Order rated ${newRating} stars!`);
      } else {
        toast.success("Rating cleared.");
      }
    } catch (error) {
      console.error("Error updating order rating:", error);
      setRating(order.orderRating || 0);
      toast.error("Failed to update rating.");
    }
  };

  // order.deliveryStatus ya order.status dono ko handle kar raha hai
  const config = getStatusConfig(order.deliveryStatus || order.status, order);

  // Multiple formats of items handling
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
            <p className={styles.statusDate}>{config.date}</p>

            {/* Display Cancellation/Refund Reason */}
            {config.reason && (
              <p className={styles.reasonText}>
                <span></span> {config.reason}
              </p>
            )}

            {/* Display Refund Amount Info */}
            {config.refundedAmount && (
              <p className={styles.refundText}>
                {config.refundedAmount}
              </p>
            )}
          </div>
        </div>
        <div className={styles.metaGroup}>
          <p>Order Date: <span>{formatDate(order.date_created || order.createdAt || order.updatedAt)}</span></p>
          <p>Order ID: <span>#{order.id || order.invoiceId}</span></p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* INSET BOX FOR ITEMS */}
      <div className={styles.itemsBox}>
        <div className={styles.itemsBoxHeader}>
          <span>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
          <div className={styles.detailsLink} onClick={() => router.push(`/account/orders/${order.id}`)}>
            Order details
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L5 5L1 1" stroke="#6E736A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className={styles.productList}>
          {visibleItems.map((item, idx) => (
            <div key={idx} className={styles.productRow}>
              <div className={styles.imageContainer}>
                <Image
                  src={formatImageUrl(item.productImage?.url || item.product?.productImage?.url) || "/order.png"}
                  alt={item.product?.name || item.name || "Product"}
                  width={80}
                  height={80}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productDetails}>
                <h4>{item.product?.name || item.name || "Product name"} {item.product.tagline}</h4>
                <p>{item.variantName || item.product?.variants?.[0]?.variantName || ""}g | Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className={styles.moreText}>+ {remainingCount} more</p>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS & SUBSCRIPTION TEXT */}
      {(config.showCancel || config.bottomText) && (
        <div className={styles.cardFooter}>
          {config.bottomText && (
            <p className={styles.bottomText}>{config.bottomText}</p>
          )}

          {config.showCancel && (
            <button
              className={styles.cancelButton}
              onClick={() => handleCancelButton(order.id)}
            >
              Cancel Order
            </button>
          )}
        </div>
      )}

      {/* Logic for Rating Display */}
      {config.rating && (
        <div className={styles.fiveStar}>
          <p>Rate this order</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((starNumber) => {
              const isActive = starNumber <= (hover || rating);
              return (
                <button
                  key={starNumber}
                  className={styles.starButton}
                  onClick={() => handleRating(starNumber)}
                  onMouseEnter={() => setHover(starNumber)}
                  onMouseLeave={() => setHover(0)}
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="-1 -1 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="9,0.5 11.5,6.5 18,7.2 13.2,11.5 14.7,17.5 9,14.2 3.3,17.5 4.8,11.5 0,7.2 6.5,6.5"
                      fill={isActive ? "white" : "transparent"}
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                      style={{ transition: "fill 0.2s ease" }}
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
