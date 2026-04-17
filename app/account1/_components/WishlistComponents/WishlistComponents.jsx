"use client";
import React from 'react';
import Image from 'next/image';
import styles from './WishlistComponents.module.css';

import coffeeImg from './coffee.png'; 

const WishlistPage = () => {
  const products = [
    {
      id: 1,
      name: "Indonesia Banner Mariah Triple Wet Hull",
      notes: "Citrus, nutty, chocolate",
      price: "AED 60",
      image: coffeeImg 
    },
    {
      id: 2, 
      name: "Indonesia Banner Mariah Triple Wet Hull",
      notes: "Citrus, nutty, chocolate",
      price: "AED 60",
      image: coffeeImg
    },
    {
      id: 3, 
      name: "Indian Banner Mariah Triple Wet Hull",
      notes: "Hazelnut, chocolate",
      price: "AED 67",
      image: coffeeImg
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wishlist</h1>
      
        <p className={styles.itemCount}>
        ({products.length} {products.length === 1 ? 'item' : 'items'})
        </p>
      </header>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <Image 
                src={product.image} 
                alt={product.name} 
                className={styles.img} 
                priority={product.id === 1} 
              />
              <button className={styles.removeBtn} aria-label="Remove from wishlist">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productNotes}>{product.notes}</p>
              
             <div className={styles.priceActionWrapper}>
    <span className={styles.price}>{product.price}</span>
    <button className={styles.addToCart}>
      Add to Cart
    </button>
  </div>
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;