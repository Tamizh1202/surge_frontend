"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Coffees.module.css";
import coffeeBagImg from "./coffees.png";
import Link from "next/link";
import axiosClient from '@/lib/axios';
import { formatImageUrl } from '@/lib/imageUtils';

const toSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getCategorySlug = (coffee) =>
  coffee.categories?.[0]?.slug ||
  coffee.categories?.slug ||
  coffee.category?.slug ||
  coffee.category ||
  'coffee-beans';

export default function Coffees() {
  const [coffeeData, setCoffeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get(`/api/web-products`, {
          params: {
            limit: 5,
            depth: 1,
            'where[_status][equals]': 'published',
            'where[categories.slug][equals]': 'coffee-beans',
          },
        });
        const docs = res.data.docs || [];
        setCoffeeData(docs);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getCardsInView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth <= 650) return 1.25;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const maxIndex = Math.ceil(coffeeData.length - getCardsInView());

  const scroll = (dir) => {
    const el = gridRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.coffeeCard}`);
    if (!card) return;
    const gap = window.innerWidth <= 650 ? 15 : 40;
    const step = card.offsetWidth + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    setCurrentIndex((prev) => {
      const next = prev + dir;
      return Math.min(Math.max(next, 0), maxIndex);
    });
  };

  return (
    <section className={styles.selectedSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerText}>
          <h2 className={styles.selectedHeading}>Selected Coffees</h2>
          <p className={styles.selectedSubtext}>
            The Surge coffee experience, delivered seamlessly to your door. Exceptional quality, on your terms.
          </p>
        </div>

        <div className={styles.sliderControls}>
          <button
            className={`${styles.arrowBtn} ${currentIndex === 0 ? styles.disabled : ""}`}
            onClick={() => scroll(-1)}
            disabled={currentIndex === 0}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M6.75 0.75L0.75 6.75L6.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`${styles.arrowBtn} ${currentIndex >= maxIndex ? styles.disabled : styles.activeBtn}`}
            onClick={() => scroll(1)}
            disabled={currentIndex >= maxIndex}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M0.75 0.75L6.75 6.75L0.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.sliderWindow}>
        <div className={styles.coffeeGrid} ref={gridRef}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${styles.coffeeCard} ${styles.skeleton}`} />
            ))
            : coffeeData.map((coffee, i) => {
              const categorySlug = getCategorySlug(coffee);
              const productSlug = coffee.slug || toSlug(coffee.name);

              return (
                <Link key={coffee.id ?? i} href={`/shop/${categorySlug}/${productSlug}`} className={styles.coffeeCard}>
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={formatImageUrl(coffee.productImage) || coffeeBagImg}
                      alt={coffee.name}
                      width={300}
                      height={400}
                      className={styles.productImg}
                      priority
                    />
                  </div>
                  <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.coffeeName}>{coffee.name}</h3>
                      <p className={styles.coffeeNotes}>{coffee.tagline || coffee.description}</p>
                      <p className={styles.price}>
                        {coffee.salePrice ? `AED ${coffee.salePrice}` : coffee.regularPrice ? `AED ${coffee.regularPrice}` : ''}
                      </p>
                    </div>
                    <span className={styles.cardArrow}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
