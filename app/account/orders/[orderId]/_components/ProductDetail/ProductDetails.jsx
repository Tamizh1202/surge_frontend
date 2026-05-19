"use client";

import Image from "next/image";
import styles from "./ProductDetails.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import React, { useState, useEffect } from "react";
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";

const ProductDetail = ({ order }) => {
  const [rating, setRating] = useState(order?.orderRating || 0);
  const [hover, setHover] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(order?.deliveryStatus || order?.status);
  const [storedSelections, setStoredSelections] = useState([]);


  const getProductId = (item) => {
    const product = item.product;
    if (product && typeof product === "object") return product.id;
    return product || item.productId || item.id || "";
  };

  const getVariantId = (item) => item.variantID || item.variantId || item.vId || "";

  useEffect(() => {
    if (!order) return;

    // 1. Sync Cancellation Status
    const cancelledList = JSON.parse(localStorage.getItem("cancelled_orders_cache") || "[]");
    if (cancelledList.includes(order.id)) {
      setCurrentStatus('cancelled');
    } else {
      setCurrentStatus(order.deliveryStatus || order.status);
    }

    // 2. Fetch Roast/Grind from LocalStorage (Syncing with OrderCard logic)
    try {
      const orderStorageId = order.id || order.invoiceId;
      const stored = JSON.parse(localStorage.getItem("orderCustomSelections") || "{}");
      setStoredSelections(stored[orderStorageId] || []);
    } catch (error) {
      console.error("Failed to read order selections", error);
    }
  }, [order]);

  if (!order) return null;

  const config = getStatusConfig(currentStatus, order);
  const items = order.items || order.line_items || [];

  // --- Logic to get Roast/Grind Text ---
  const getItemSelectionsText = (item) => {
    const productId = String(getProductId(item));
    const variantId = String(getVariantId(item));
    
    const match = storedSelections.find((s) => {
      return String(s.productId || "") === productId && String(s.variantId || "") === variantId;
    });

    if (match && match.customSelections) {
      return Object.values(match.customSelections)
        .filter(val => val && String(val).trim() !== "" && String(val).toLowerCase() !== item.product?.tagline?.toLowerCase())
        .join(", ");
    }

    const fallback = item.customSelections || item.customization || {};
    return Object.values(fallback)
      .filter(val => typeof val === 'string' && val.trim() !== "" && val.toLowerCase() !== item.product?.tagline?.toLowerCase())
      .join(", ");
  };

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
      setRating(order.orderRating || 0);
      toast.error("Failed to update rating.");
    }
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderTop}>
        <div className={styles.orderTopLeft}>
          <span className={styles.statusIcon}>{config.icon}</span>
          <div>
            <p className={styles.orderStatusTitle} style={{ color: config.color, fontWeight: '600', margin: 0 }}>
              {config.label}
            </p>
            <p className={styles.orderDateSub} style={{ margin: '4px 0' }}>
              {config.date}
            </p>
            
            {currentStatus === 'cancelled' && (
              <div className={styles.cancelDetailsContainer} style={{ marginTop: '4px' }}>
                <p className={styles.reasonText} style={{ fontSize: '12px', color: '#818686', fontWeight: '400', fontFamily: 'Raleway, sans-serif', margin: '0', lineHeight: '1.4' }}>
                  {config.reason}
                </p>
                <p className={styles.refundText} style={{ fontSize: '12px', color: '#818686', fontWeight: '400', fontFamily: 'Raleway, sans-serif', margin: '0', lineHeight: '1.2' }}>
                  {config.refundedAmount}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.orderTopRight}>
          <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
          <p>Order ID: <span>#{order.id}</span></p>
        </div>
      </div>

      <div className={`${styles.orderMobileMeta} ${config.noBottom ? styles.orderMobileMetaNoBorder : ""}`}>
        <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
        <p>Order ID: <span>#{order.id}</span></p>
      </div>

      <div className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}>
        <div className={styles.orderItems}>
          {items.map((item, idx) => {
            const itemImg = item.productImage?.url || item.product?.productImage?.url;
            const itemName = item.product?.name || item.name || "Coffee Product";
            
            // Get Roast/Grind text
            const selectionText = getItemSelectionsText(item);

            const weight = item.product?.variants?.find(v => v.id === item.variantID || v.id === item.variantId)?.variantName 
                           || item.product?.weight;

            return (
              <div className={styles.orderItem} key={idx}>
                <Image
                  src={formatImageUrl(itemImg) || "https://placehold.co/100x100"}
                  alt={itemName}
                  width={85}
                  height={85}
                  className={styles.orderItemImg}
                />
                <div className={styles.orderItemInfo}>
                  <p className={styles.itemName}>
                    {itemName} {item.product?.tagline && `- ${item.product.tagline}`}
                  </p>
                  
                  {/* Roast & Grind Display */}
                  {selectionText && (
                    <p style={{ fontSize: '12px', color: '#818686', margin: '4px 0 22px', textTransform: 'capitalize' }}>
                      {selectionText}
                    </p>
                  )}

                  <div className={styles.itemMeta}>
                    {weight && (
                      <>
                        <span>{weight}{!isNaN(weight) ? 'g' : ''}</span>
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

      {config.rating && (
        <div className={styles.rateOrderFooter}>
          <span className={styles.rateOrderText}>Rate This Order</span>
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                >
                  <svg width="20" height="20" viewBox="-1 -1 20 20" fill="none">
                    <polygon
                      points="9,0.5 11.5,6.5 18,7.2 13.2,11.5 14.7,17.5 9,14.2 3.3,17.5 4.8,11.5 0,7.2 6.5,6.5"
                      fill={isActive ? "white" : "transparent"}
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
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

export default ProductDetail;