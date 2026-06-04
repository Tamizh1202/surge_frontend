
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Addone.module.css';

import img1 from './m1.webp';
import img2 from './m2.webp';
import img3 from './m3.webp';

const categoryImages = [img1, img2, img3];

export default function CoffeeGrid() {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
    fetch(`${baseUrl}/api/addons-menu?limit=10&depth=0&sort=_order`)
      .then((res) => res.json())
      .then((data) => setCategories(data.docs ?? []));
  }, []);

  const current = categories[activeIndex];

  if (!current) return null;

  return (
    <main className={styles.container}>
      <h2 className={styles.sectionHeading}>Add-ons Menu</h2>

      <div className={styles.layoutGrid}>

        <div className={styles.imageWrapper}>
          <Image
            src={categoryImages[activeIndex] ?? img1}
            alt={current.subtitle}
            className={styles.mainImg}
            fill
            sizes="(max-width: 901px) 100vw, 50vw"
            priority
          />
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.tabContainer}>
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                className={`${styles.tabButton} ${activeIndex === idx ? styles.activeTab : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{current.subtitle}</h3>
            <p className={styles.cardDesc}>{current.tagline}</p>

            <ul className={styles.pointsList}>
              {current.items.map((item) => (
                <li key={item.id} className={styles.pointItem}>
                  <span className={styles.squareIcon}>
                    <svg width="6" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="6" height="4" fill="#818686"/>
                    </svg>
                  </span>
                  {item.name}
                </li>
              ))}
            </ul>

            <a href="#enquiry-form" className={styles.enquireLink}>
              Enquire Now
              <span className={styles.arrow}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201" stroke="#C4754E" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
