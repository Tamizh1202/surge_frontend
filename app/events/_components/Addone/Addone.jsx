
"use client"; 
import { useState } from 'react';
import Image from 'next/image';
import styles from './Addone.module.css';

import img1 from './m1.webp'; 
import img2 from './m2.webp'; 
import img3 from './m3.webp'; 

export const menuData = {
  coffee: {
    tabLabel: "Coffee",
    title: "Coffee", 
    desc: "Savory selections for elevated catering.",
    img: img1,
    points: [
      "Espresso",
      "Cappuccino",
      "Americano ( Hot/ Cold)",
      "Coffee Latte (Hot/ Cold)",
      "Cortado",
      "Oriental Latte (Hot/ Col", 
      "Piccolo",
      "Copiko Latte (Hot/ Cold)",
      "Flat White",
      "Cold Drip"
    ]
  },
  sweets: {
    tabLabel: "Sweets",
    title: "Sweets Menu",
    desc: "House-made sweet bites — crafted to complement every cup perfectly.",
    img: img2,
    points: [
      "Oreo Truffle",
      "Lotus Truffle",
      "Mini Choco Chip Cookies",
      "Mini Strawberry Cream Cheese Cookies",
      "Mini Macadamia Cookies",
      "Mini Red Velvet Cookies",
      "Mini Browkies",
      "Mini Oat Brownie",
      "Mini Plain Croissant",
      "Mini Cheese Croissant",
      "Mini Za’atar Croissant",
      "Mini Almond Croissant"
    ]
  },
  canapes: {
    tabLabel: "Canapés",
    title: "Small Bites / Canapés",
    desc: "Savoury selections crafted for elevated, memorable catering moments.",
    img: img3,
    points: [
      "Mini Breakfast Burger",
      "Bruschetta Bites",
      "Tuna Crostini",
      "Turkey Cheese Bagel"
    ]
  }
};

export default function CoffeeGrid() {
  const [activeTab, setActiveTab] = useState('coffee');
  const currentData = menuData[activeTab];

  return (
    <main className={styles.container}>
      <h2 className={styles.sectionHeading}>Add-ons Menu</h2>

      <div className={styles.layoutGrid}>
      
        <div className={styles.imageWrapper}>
          <Image
            src={currentData.img}
            alt={currentData.title}
            className={styles.mainImg}
        fill
            sizes="(max-width: 901px) 100vw, 50vw"
            priority
          />
        </div>


        <div className={styles.contentColumn}>
          <div className={styles.tabContainer}>
            {Object.keys(menuData).map((key) => (
              <button
                key={key}
                className={`${styles.tabButton} ${activeTab === key ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {menuData[key].tabLabel}
              </button>
            ))}
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{currentData.title}</h3>
            <p className={styles.cardDesc}>{currentData.desc}</p>

            <ul className={styles.pointsList}>
              {currentData.points.map((point, i) => (
                <li key={i} className={styles.pointItem}>
                  <span className={styles.squareIcon}>
                    <svg width="6" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="6" height="4" fill="#818686"/>
                    </svg>
                  </span>
                  {point}
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