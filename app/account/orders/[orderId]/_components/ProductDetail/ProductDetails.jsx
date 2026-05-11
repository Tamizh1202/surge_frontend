"use client";

import Image from "next/image";
import styles from "./ProductDetails.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import React, { useState } from "react"; // useState add kiya
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";
import axiosClient from "@/lib/axios"; // axios import kiya
import toast from "react-hot-toast"; // toast import kiya

const ProductDetail = ({ order }) => {
  if (!order) return null;

  const [rating, setRating] = useState(order.orderRating || 0);
  const [hover, setHover] = useState(0);

  const config = getStatusConfig(order.deliveryStatus || order.status, order);
  const items = order.items || order.line_items || [];

  // Rating handle karne ka logic
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
            
            {/* Reason text add kiya (Cancellations ke liye) */}
            {config.reason && (
              <p className={styles.reasonText} style={{ fontSize: '12px', marginTop: '4px' }}>
                {config.reason}
              </p>
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

      {/* ITEMS SECTION */}
      <div className={`${styles.orderMiddle} ${config.noBottom ? styles.orderMiddleNoBottom : ""}`}>
        <div className={styles.orderItems}>
          {items.map((item, idx) => {
            const itemImg = item.productImage?.url || item.product?.productImage?.url;
            const itemName = item.product?.name || item.name || "Coffee Product";
            
            const weight = item.product?.variants?.find(v => v.id === item.variantID)?.variantName 
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

      {/* FOOTER SECTION: Rate This Order (Same as OrderCard logic) */}
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

      {/* MOBILE METADATA */}
     
    </div>
  );
};

export default ProductDetail;