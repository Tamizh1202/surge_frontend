"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axios";
import styles from "./ShopSelector.module.css";

export default function ShopSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedShopId = searchParams.get("shop");
  const currentShop = shops.find((s) => String(s.id) === selectedShopId) || shops[0];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axiosClient.get("/api/shop");
        if (response.data && response.data.docs) {
          setShops(response.data.docs);
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShopSelect = (shopId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("shop", shopId);
    params.delete("category");
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  if (loading || shops.length === 0) return null;

  return (
    <div className={styles.shopSelectorContainer}>
      <span className={styles.labelPrefix}>Menu for -</span>

      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <div className={`${styles.mainBox} ${isOpen ? styles.boxOpen : ""}`}>
          
          <div className={styles.triggerRow} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.selectedDisplay}>
              <span className={styles.selectedName}>
                {currentShop?.address.street}, {currentShop?.address.city}
              </span>
              <svg 
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {isOpen && (
            <div className={styles.menuPanel}>
              {shops.map((shop) => {
                const isSelected = String(shop.id) === selectedShopId;
                return (
                  <div 
                    key={shop.id} 
                    className={styles.menuItem}
                    onClick={() => handleShopSelect(shop.id)}
                  >
                    <span className={`${styles.itemText} ${isSelected ? styles.itemActive : ""}`}>
                      {shop.address.street}, {shop.address.city}
                    </span>
                    <div className={`${styles.radioCircle} ${isSelected ? styles.radioActive : ""}`}>
                      {isSelected && <div className={styles.radioInner} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}