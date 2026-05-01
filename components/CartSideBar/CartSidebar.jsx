"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CartSideBar.module.css";
import { useCart } from "@/app/_context/CartContext";
import { useRouter } from "next/navigation";
import { formatImageUrl } from "@/lib/imageUtils";
import Link from "next/link";
import cartZero from "./cartZero.png";

const CartSideBar = () => {
  const {
    isCartOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    cartTotals,
    loading,
  } = useCart();

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [itemErrors, setItemErrors] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Logic: Sum up all quantities for the total count
  const totalQuantity = items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
  const isCartEmpty = totalQuantity === 0;

  const handleIncrease = async (product, vId) => {
    const key = `${product}_${vId || ""}`;
    const result = await updateQuantity(product, vId, null, "increment");
    if (result && !result.ok) {
      setItemErrors((prev) => ({ ...prev, [key]: result.message }));
    } else {
      setItemErrors((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  const handleDecrease = async (product, vId, currentQty) => {
    if (currentQty > 1) {
      const key = `${product}_${vId || ""}`;
      setItemErrors((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
      await updateQuantity(product, vId, null, "decrement");
    }
  };

  const handleRemove = async (product, vId) => {
    await removeItem(product, vId);
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout?mode=cart");
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${isCartOpen ? styles.overlayVisible : ""}`}
        onClick={closeCart}
      />

      <aside className={`${styles.sidebar} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h4>Your Cart</h4>
            {/* Updated item count display */}
            <span>({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.itemList}>
            {isCartEmpty ? (
              <div className={styles.EmptyState}>
                <Image src={cartZero} alt="No products" width={145} height={160} />
                <h4>Your Cart is empty</h4>
                <p>Explore our curated coffee collections.</p>
                <button
                  className={styles.StartShopping}
                  onClick={() => {
                    closeCart();
                    router.push("/shop");
                  }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const key = `${item.product}_${item.vId || ""}`;
                return (
                  <div className={styles.productCard} key={key}>
                    <div className={styles.prodImageWrapper}>
                      <Image
                        src={formatImageUrl(item.image)}
                        alt={item.name}
                        width={100}
                        height={100}
                        className={styles.prodImage}
                      />
                    </div>

                    <div className={styles.prodInfo}>
                      <div className={styles.prodHeader}>
                        <div className={styles.nameGroup}>
                          <h5>{item.name}</h5>
                          <p className={styles.tagline}>
                            {item.tagline} {item.variantName ? `, ${item.variantName}` : ""}
                          </p>
                        </div>
                        <button className={styles.removeIconBtn} onClick={() => handleRemove(item.product, item.vId)}>
                          <TrashIcon />
                        </button>
                      </div>

                      <div className={styles.prodFooter}>
                        <div className={styles.qtyContainer}>
                          <div className={styles.qtyControls}>
                            <button
                              onClick={() => handleDecrease(item.product, item.vId, item.quantity)}
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon />
                            </button>
                            <span>{String(item.quantity).padStart(2, "0")}</span>
                            <button
                              onClick={() => handleIncrease(item.product, item.vId)}
                              disabled={!!itemErrors[key]}
                            >
                              <PlusIcon />
                            </button>
                          </div>
                          {itemErrors[key] && (
                            <p className={styles.errorText}>{itemErrors[key]}</p>
                          )}
                        </div>
                        <span className={styles.price}>
                          AED {Number(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {!isCartEmpty && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span>AED {Number(cartTotals?.subtotal || 0).toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
            <p className={styles.taxDisclaimer}>
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

// Icons (keeping your existing ones)
const CloseIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.4 14.5954L0 13.1359L5.6 7.29772L0 1.45954L1.4 0L7 5.83818L12.6 0L14 1.45954L8.4 7.29772L14 13.1359L12.6 14.5954L7 8.75727L1.4 14.5954Z" fill="#414343" />
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.75 4.75V18.75C16.75 19.2804 16.5393 19.7891 16.1642 20.1642C15.7891 20.5393 15.2804 20.75 14.75 20.75H4.75C4.21957 20.75 3.71086 20.5393 3.33579 20.1642C2.96071 19.7891 2.75 19.2804 2.75 18.75V4.75M0.75 4.75H18.75M5.75 4.75V2.75C5.75 2.21957 5.96071 1.71086 6.33579 1.33579C6.71086 0.960714 7.21957 0.75 7.75 0.75H11.75C12.2804 0.75 12.7891 0.960714 13.1642 1.33579C13.5393 1.71086 13.75 2.21957 13.75 2.75V4.75" stroke="#414343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.97988 2.16106V3.05706H2.99588V5.21706H1.98788V3.05706H0.00387502V2.16106H1.98788V0.00106239H2.99588V2.16106H4.97988Z" fill="#C4754E" />
  </svg>
);

const MinusIcon = () => (
  <svg width="5" height="1" viewBox="0 0 5 1" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.000937581 1.01119V0.00318718H4.67294V1.01119H0.000937581Z" fill="#C4754E" />
  </svg>
);

export default CartSideBar;