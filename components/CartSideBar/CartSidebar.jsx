"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CartSideBar.module.css";
import { useCart } from "@/app/_context/CartContext"; 
import coffeebag from './c.png'
import Link from "next/link";

const cartData = {
  products: [
    {
      product_id: 1,
      name: "Indonesia Meriah Anaerobic Natural, 1kg",
      image: coffeebag, 
      quantity: 1,
      price: 16.00
    },
    {
      product_id: 2,
      name: "Indonesia Meriah Anaerobic Natural, 1kg",
      image: coffeebag,
      quantity: 1,
      price: 16.00
    }
  ],
  subtotal: 32.00,
  total: 42.00
};

const CartSideBar = () => {
 
  const { isCartOpen, closeCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (!isMounted || !isCartOpen) return null;

  return (
    <>
      {/* Overlay click par closeCart function call hoga */}
      <div className={styles.overlay} onClick={closeCart} />
      
      <aside className={`${styles.sidebar} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h4>Your Cart</h4>
            <span>({cartData.products.length} items)</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.itemList}>
            {cartData.products.map((item) => (
              <div className={styles.productCard} key={item.product_id}>
                <div className={styles.prodImageWrapper}>
                  <Image src={item.image} alt={item.name} width={100} height={100} className={styles.prodImage} />
                </div>
                
                <div className={styles.prodInfo}>
                  <div className={styles.prodHeader}>
                    <h5>{item.name}</h5>
                    <button className={styles.removeIconBtn}>
                      <TrashIcon />
                    </button>
                  </div>

                  <div className={styles.prodFooter}>
                    <div className={styles.qtyControls}>
                      <button><PlusIcon /></button>
                      <span>{item.quantity}</span>
                      <button><MinusIcon /></button>
                    </div>
                    <span className={styles.price}>
                      AED {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.subtotalRow}>
            <span>Subtotal</span>
            <span>AED {cartData.total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className={styles.checkoutLink} onClick={closeCart}>
            <button className={styles.checkoutBtn}>Checkout</button>
          </Link>
          <p className={styles.taxDisclaimer}>
            Taxes and shipping calculated at checkout
          </p>
        </div>
      </aside>
    </>
  );
};

// Icons components...
const CloseIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.4 14.5954L0 13.1359L5.6 7.29772L0 1.45954L1.4 0L7 5.83818L12.6 0L14 1.45954L8.4 7.29772L14 13.1359L12.6 14.5954L7 8.75727L1.4 14.5954Z" fill="#414343"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.75 4.75V18.75C16.75 19.2804 16.5393 19.7891 16.1642 20.1642C15.7891 20.5393 15.2804 20.75 14.75 20.75H4.75C4.21957 20.75 3.71086 20.5393 3.33579 20.1642C2.96071 19.7891 2.75 19.2804 2.75 18.75V4.75M0.75 4.75H18.75M5.75 4.75V2.75C5.75 2.21957 5.96071 1.71086 6.33579 1.33579C6.71086 0.960714 7.21957 0.75 7.75 0.75H11.75C12.2804 0.75 12.7891 0.960714 13.1642 1.33579C13.5393 1.71086 13.75 2.21957 13.75 2.75V4.75" stroke="#414343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.97988 2.16106V3.05706H2.99588V5.21706H1.98788V3.05706H0.00387502V2.16106H1.98788V0.00106239H2.99588V2.16106H4.97988Z" fill="#C4754E"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="5" height="1" viewBox="0 0 5 1" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.000937581 1.01119V0.00318718H4.67294V1.01119H0.000937581Z" fill="#C4754E"/>
  </svg>
);

export default CartSideBar;