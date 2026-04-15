"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./Coffees.module.css";
import coffeeBagImg from "./coffees.png";

const coffeeData = [
  { id: 1, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
  { id: 2, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
  { id: 3, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
  { id: 4, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
  { id: 5, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
  { id: 6, name: "Indonesia Banner Mariah Triple Wet Hull", notes: "Citrus, nutty, chocolate", price: "AED 60", image: coffeeBagImg },
];

export default function Coffees() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const cardsToShow = 3;
  const maxIndex = coffeeData.length - cardsToShow;

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.coffeeCard}`);
    if (!card) return;
    const step = card.offsetWidth + 40;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    setCurrentIndex(prev => Math.min(Math.max(prev + dir, 0), maxIndex));
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
              <path d="M6.75 0.75L0.75 6.75L6.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            className={`${styles.arrowBtn} ${currentIndex >= maxIndex ? styles.disabled : styles.activeBtn}`}
            onClick={() => scroll(1)}
            disabled={currentIndex >= maxIndex}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 0.75L6.75 6.75L0.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.sliderWindow} ref={sliderRef}>
        <div className={styles.coffeeGrid}>
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
                <div className={styles.cardArrow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}