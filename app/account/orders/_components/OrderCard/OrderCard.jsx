"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./OrderCard.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import { getStatusConfig, formatDate } from "@/app/account/orders/_components/GetStatus";
import { useRouter } from 'next/navigation';
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";
import CancelOrderPopup from "@/app/account/orders/_components/CancelOrderPopup/CancelOrderPopup";

const getDisplaySelections = (item) => {
  const values = [];
  const addValue = (value) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(addValue);
      return;
    }
    if (typeof value === "object") {
      Object.values(value).forEach(addValue);
      return;
    }
    const text = String(value).trim();
    if (text) values.push(text);
  };

  addValue(item.customization);
  addValue(item.customizations);
  addValue(item.customSelections);
  addValue(item.selectedOptions);
  addValue(item.selectedVariant);

  if (Array.isArray(item.meta_data)) {
    item.meta_data.forEach((meta) => {
      const key = String(meta?.key || "").toLowerCase();
      if (key.includes("custom") || key.includes("option") || key.includes("grind")) {
        addValue(meta?.value);
      }
    });
  }

  return [...new Set(values)];
};

const getProductId = (item) => {
  const product = item.product;
  if (product && typeof product === "object") return product.id;
  return product || item.productId || item.id || "";
};

const getVariantId = (item) => item.variantID || item.variantId || item.vId || "";

const getStoredOrderSelections = (orderId) => {
  if (!orderId || typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(localStorage.getItem("orderCustomSelections") || "{}");
    return stored[orderId] || [];
  } catch (error) {
    console.error("Failed to read order selections", error);
    return [];
  }
};

const getStoredItemSelections = (storedSelections, item) => {
  const productId = String(getProductId(item));
  const variantId = String(getVariantId(item));

  const match = storedSelections.find((selection) => {
    const selectionProductId = String(selection.productId || "");
    const selectionVariantId = String(selection.variantId || "");
    return selectionProductId === productId && selectionVariantId === variantId;
  });

  if (!match) return [];
  return Object.entries(match.customSelections || {}).filter(([, value]) => String(value).trim() !== "");
};

const OrderCard = ({ order, handleCancelButton }) => {
  if (!order) return null;
  const router = useRouter();

  const [rating, setRating] = useState(order.orderRating || 0);
  const [hover, setHover] = useState(0);
  const orderStorageId = order.id || order.invoiceId;
  const [storedSelections, setStoredSelections] = useState([]);

  const [currentStatus, setCurrentStatus] = useState(order.deliveryStatus || order.status);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  React.useEffect(() => {
    setStoredSelections(getStoredOrderSelections(orderStorageId));
  }, [orderStorageId]);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.deliveryStatus || order.status);
    }
  }, [order.deliveryStatus, order.status]);

  const handleCancelConfirm = async (reason) => {
    try {
      const response = await axiosClient.get(
        `/api/web-orders/${order.id}/cancel?reason=${encodeURIComponent(reason)}`
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");

        setCurrentStatus('cancelled');
        setIsPopupOpen(false);

        // Server data refresh
        router.refresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const config = getStatusConfig(currentStatus, order);

  const items = order.docs || order.items || [];
  const visibleItems = items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  return (
    <div className={styles.orderCard}>
      <div className={styles.cardHeader}>
        <div className={styles.statusGroup}>
          <div className={styles.iconWrapper}>{config.icon}</div>
          <div className={styles.statusTexts}>
            <h3 style={{ color: config.color }}>{config.label}</h3>
            <p className={styles.statusDate}>
              {currentStatus === 'cancelled'
                ? (order.cancelledOn ? `On ${formatDate(order.cancelledOn)}` : `On ${formatDate(new Date())}`)
                : config.date}
            </p>
            {currentStatus === 'cancelled' && (
              <p className={styles.refundText}>
                Refund initiated. It may take 7-8 working days.
              </p>
            )}
          </div>
        </div>
        <div className={styles.metaGroup}>
          <p>Order Date: <span>{formatDate(order.createdAt)}</span></p>
          <p>Order ID: <span>#{order.id}</span></p>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.itemsBox}>
        <div className={styles.itemsBoxHeader}>
          <span>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
          <div className={styles.detailsLink} onClick={() => router.push(`/account/orders/${order.id}`)}>
            Order details &gt;
          </div>
        </div>

        <div className={styles.productList}>
          {visibleItems.map((item, idx) => {
            const storedItemSelections = getStoredItemSelections(storedSelections, item);
            const displaySelections = storedItemSelections.length > 0
              ? storedItemSelections
              : getDisplaySelections(item).map((value) => ["", value]);
            const selectedText = displaySelections.map(([, value]) => value).join(", ");
            const variantName = item.variantName || item.product?.variants?.[0]?.variantName || "";
            const metaParts = [
              variantName ? `${variantName}g` : "",
              selectedText,
            ].filter(Boolean);

            return (
              <div key={idx} className={styles.productRow}>
                <div className={styles.imageContainer}>
                  <Image
                    src={formatImageUrl(item.productImage?.url || item.product?.productImage?.url) || "/order.png"}
                    alt={item.product?.name || item.name || "Product"}
                    fill
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productDetails}>
                  <h4>{item.product?.name || item.name || "Product name"}</h4>
                  {metaParts.length > 0 && (
                    <p className={styles.selectedOptions}>{metaParts.join(" | ")}</p>
                  )}
                </div>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <p className={styles.moreText}>+ {remainingCount} more</p>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        {currentStatus !== 'cancelled' && config.showCancel && (
          <button className={styles.cancelButton} onClick={() => setIsPopupOpen(true)}>
            Cancel Order
          </button>
        )}
      </div>

      {isPopupOpen && (
        <CancelOrderPopup
          orderId={order.id}
          onClose={() => setIsPopupOpen(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default OrderCard;