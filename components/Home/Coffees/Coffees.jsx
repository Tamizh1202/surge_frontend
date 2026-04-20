"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./Coffees.module.css";
import coffeeBagImg from "./coffees.png";
import Link from "next/link"; 

const coffeeData = [
  { 
    id: 1, 
    slug: "indonesia-banner-mariah", 
    name: "Indonesia Banner Mariah Triple Wet Hull", 
    notes: "Citrus, nutty, chocolate", 
    price: "AED 60", 
    image: coffeeBagImg 
  },
  { 
    id: 2, 
    slug: "indonesia-mariah-pods", 
    name: "Indonesia Mariah Nespresso Pods", 
    notes: "Floral, berry, bright", 
    price: "AED 65", 
    image: coffeeBagImg 
  },
  { 
    id: 3, 
    slug: "ethiopia-guji-drip", 
    name: "Ethiopia Guji Drip Bags", 
    notes: "Citrus, nutty, chocolate", 
    price: "AED 75", 
    image: coffeeBagImg 
  },
  { 
    id: 4, 
    slug: "brazil-santos-beans", 
    name: "Brazil Santos Premium Beans", 
    notes: "Caramel, toasted almond", 
    price: "AED 55", 
    image: coffeeBagImg 
  },
  { 
    id: 5, 
    slug: "surge-logo-merch-shirt", 
    name: "Surge Collective Oversized Tee", 
    notes: "100% Cotton, Heavyweight", 
    price: "AED 120", 
    image: coffeeBagImg 
  },
  { 
    id: 6, 
    slug: "colombia-huila-beans", 
    name: "Colombia Huila Dark Roast", 
    notes: "Dark chocolate, molasses", 
    price: "AED 58", 
    image: coffeeBagImg 
  },
  { 
    id: 7, 
    slug: "guatemala-antigua-beans", 
    name: "Guatemala Antigua Classic", 
    notes: "Spice, cocoa, smokey", 
    price: "AED 70", 
    image: coffeeBagImg 
  },
  { 
    id: 8, 
    slug: "kenya-aa-specialty", 
    name: "Kenya AA Kirinyaga", 
    notes: "Blackcurrant, bright acidity", 
    price: "AED 80", 
    image: coffeeBagImg 
  },
  { 
    id: 9, 
    slug: "surge-travel-mug", 
    name: "Surge Travel Tumbler", 
    notes: "Matte Black, 12oz", 
    price: "AED 95", 
    image: coffeeBagImg 
  },
];

export default function Coffees() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  // const cardsToShow = 3;

  const gridRef = useRef(null);
  const getCardsInView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth <= 650) return 1.25; // Matching your 80% width CSS
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };
  const maxIndex = Math.ceil(coffeeData.length - getCardsInView());
  const scroll = (dir) => {
    const el = gridRef.current;
    if (!el) return;

    const card = el.querySelector(`.${styles.coffeeCard}`);
    if (!card) return;

    // 3. Match the CSS gap (40px desktop, 15px mobile)
    const gap = window.innerWidth <= 650 ? 15 : 40;
    const step = card.offsetWidth + gap;

    // 4. Scroll the element
    el.scrollBy({ left: dir * step, behavior: "smooth" });

    // 5. Update index, allowing it to reach the NEW maxIndex
    setCurrentIndex(prev => {
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
            The White Mantis coffee experience, delivered seamlessly to your door. Subscribe for a never-ending supply of excellence.
          </p>
        </div>

        <div className={styles.sliderControls}>
          <button
            className={`${styles.arrowBtn} ${currentIndex === 0 ? styles.disabled : ""}`}
            onClick={() => scroll(-1)}
            disabled={currentIndex === 0}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 0.75L0.75 6.75L6.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className={`${styles.arrowBtn} ${currentIndex >= maxIndex ? styles.disabled : styles.activeBtn}`}
            onClick={() => scroll(1)}
            disabled={currentIndex >= maxIndex}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 0.75L6.75 6.75L0.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.sliderWindow}>
        <div className={styles.coffeeGrid} ref={gridRef}>
          {coffeeData.map((coffee, i) => (
            <div key={i} className={styles.coffeeCard}>
              <div className={styles.productImageWrapper}>
                <Image
                  src={coffee.image}
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
                  <p className={styles.coffeeNotes}>{coffee.notes}</p>
                  <p className={styles.price}>{coffee.price}</p>
                </div>
               <Link 
  href={`/Productdetails/${coffee.slug}`} 
  className={styles.cardArrow}
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
</Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}