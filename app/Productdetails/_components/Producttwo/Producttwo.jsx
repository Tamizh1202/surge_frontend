"use client";
import { useState, Fragment } from 'react';
import Image from 'next/image';
import styles from './Product.module.css';
import coffeeImg from './t.png';
// import coffeeVid from "../../../../public/vid.mp4"

const brewingData = {
  Filter: {
    "Ratio": "1:15",
    "Water Weight": "255 ml",
    "Coffee Age": "17-14 days (ideal)",
    "Temperature": "90°C - 93°C",
    "Brew Time": "2.5–3 minutes",
    "Coffee Grind Size": "1:Medium fine (like table salt; 21-28 clicks in Comandante MK4 and 14-18 clicks in Time more C2)"
  },
  Espresso: {
    "Ratio": "1:2",
    "Water Weight": "36g-40g",
    "Coffee Age": "7-21 days",
    "Temperature": "92°C - 95°C",
    "Brew Time": "25–30 sec",
    "Coffee Grind Size": "Fine (7-12 clicks)"
  },
  Milk: {
    "Ratio": "1:3",
    "Water Weight": "150ml milk",
    "Coffee Age": "Fresh",
    "Temperature": "60°C - 65°C",
    "Brew Time": "N/A",
    "Coffee Grind Size": "Espresso fine"
  }
};

export default function Producttwo() {
  const [activeTab, setActiveTab] = useState('Filter');
  const data = brewingData[activeTab];
  const tabKeys = Object.keys(brewingData);

  return (
    <div className={styles.container}>
      <section className={styles.Section}>
        <h2 className={styles.title}>Brewing guide</h2>




        <div className={styles.tabs}>
          {tabKeys.map((tab, index) => (
            <Fragment key={tab}>
              <div
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>

              {index < tabKeys.length - 1 && <span className={styles.separator}><svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line opacity="0.5" x1="0.5" y1="2.18554e-08" x2="0.499999" y2="20" stroke="#818686" />
              </svg>
              </span>}
            </Fragment>
          ))}
        </div>

        <div className={styles.infoTable}>
          {Object.entries(data).map(([label, val]) => (
            <div className={styles.row} key={label}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{val}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.imageSection}>
        <video
          src="/vidNew.mp4"  // Just a plain string, no curly braces needed
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </section>
    </div>
  );
}