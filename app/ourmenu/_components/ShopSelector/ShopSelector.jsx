"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axios";
import styles from "./ShopSelector.module.css";

export default function ShopSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedShop = searchParams.get("shop");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axiosClient.get("/api/shop");

        if (response.status !== 200) {
          throw new Error("Failed to fetch shops");
        }

        const data = response.data;

        if (data && data.docs) {
          setShops(data.docs);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    if (!loading && shops.length > 0 && !selectedShop) {
      handleShopClick(shops[0].id);
    }
  }, [loading, shops, selectedShop]);


  const handleShopClick = (shopId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("shop", shopId);
    params.delete("category");
    router.push(`?${params.toString()}`, { scroll: false });
  };


  if (loading) {
    return (
      <div className={styles.shopSelectorContainer}>
        <p className={styles.selectorTitle}>Loading shops...</p>
      </div>
    );
  }

  if (shops.length === 0) {
    return null;
  }

  return (
    <div className={styles.shopSelectorContainer}>
      <div className={styles.headerRow}>
        <h3 className={styles.selectorTitle}>Select a Shop</h3>
        <p className={styles.selectorSubtitle}>
          Choose your preferred location to see the menu
        </p>
      </div>
      <div className={styles.shopList}>
        {shops.map((shop) => (
          <button
            key={shop.id}
            className={`${styles.shopButton} ${selectedShop === String(shop.id) ? styles.activeShop : ""
              }`}
            onClick={() => handleShopClick(shop.id)}
          >
            <div className={styles.shopIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className={styles.shopInfo}>
              <span className={styles.shopName}>{shop.address.street}</span>
              <span className={styles.shopAddress}>
                {shop.address.city}, {shop.address.apartment}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
