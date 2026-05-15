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
  // Status ko state mein rakha hai taaki UI instantly update ho sake
  const [currentStatus, setCurrentStatus] = useState(order?.deliveryStatus || order?.status);

  useEffect(() => {
    if (!order) return;

    // Check if the order was just cancelled (using the cache key from OrderCard)
    const cancelledList = JSON.parse(localStorage.getItem("cancelled_orders_cache") || "[]");
    if (cancelledList.includes(order.id)) {
      setCurrentStatus('cancelled');
    } else {
      setCurrentStatus(order.deliveryStatus || order.status);
    }
  }, [order]);

  if (!order) return null;

  // getStatusConfig ab updated status ke basis par config layega
  const config = getStatusConfig(currentStatus, order);
  const items = order.items || order.line_items || [];

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
      {/* HEADER SECTION - Image ke according change hoga */}
      <div className={styles.orderTop}>
        <div className={styles.orderTopLeft}>
          {/* Status Icon */}
          <span className={styles.statusIcon}>{config.icon}</span>
          
          <div>
          
            <p className={styles.orderStatusTitle} style={{ color: config.color, fontWeight: '600', margin: 0 }}>
              {config.label}
            </p>

          
            <p className={styles.orderDateSub} style={{ margin: '4px 0' }}>
              {config.date}
            </p>
            
            {/* Cancellation Details: Reason and Refund Info */}
            {currentStatus === 'cancelled' && (
              <div className={styles.cancelDetailsContainer} style={{ marginTop: '4px' }}>
                <p 
                  className={styles.reasonText} 
                  style={{ 
                    fontSize: '12px', 
                    color: '#818686', 
                    fontWeight: '400', 
                    fontFamily: 'Raleway, sans-serif',
                    margin: '0', 
                    lineHeight: '1.4', 
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#4b5563' }}></span> 
                  {config.reason}
                </p>
                
                <p 
                  className={styles.refundText} 
                  style={{ 
                    fontSize: '12px', 
                    color: '#818686', 
                    fontWeight: '400', 
                    fontFamily: 'Raleway, sans-serif',
                    margin: '0', 
                    lineHeight: '1.2',
                  }}
                >
                  {config.refundedAmount}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Top Right: Desktop Meta Info */}
        <div className={styles.orderTopRight}>
          <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
          <p>Order ID: <span>#{order.id}</span></p>
        </div>
      </div>

      {/* Mobile Meta Info */}
      <div className={`${styles.orderMobileMeta} ${config.noBottom ? styles.orderMobileMetaNoBorder : ""}`}>
        <p>Order Date: <span>{formatDate(order.date_created || order.createdAt)}</span></p>
        <p>Order ID: <span>#{order.id}</span></p>
      </div>

      {/* ITEMS SECTION */}
      <div className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}>
        <div className={styles.orderItems}>
          {items.map((item, idx) => {
            const itemImg = item.productImage?.url || item.product?.productImage?.url;
            const itemName = item.product?.name || item.name || "Coffee Product";
            
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

      {/* RATING FOOTER */}
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