import styles from './Coffeepackage.module.css';
import Image from "next/image";

import cupImg from './cup1.png'; 
import cupImg2 from './cup2.png';
import cupImg3 from './cup3.png';
import cupImg4 from './cup4.png';

const packages = [
  {
    id: 1,
    title: "30 Cups Package",
    description: "Perfect for small meetings, intimate celebrations, or quick pop-ups.",
    image: cupImg 
  },
  {
    id: 2,
    title: "50 Cups Package",
    description: "Ideal for medium-sized events, workshops, and office gatherings.",
    image: cupImg2 
  },
  {
    id: 3,
    title: "100 Cups Package",
    description: "Designed for large events, corporate functions, and high-footfall activations.",
    image: cupImg3
  },
  {
    id: 4,
    title: "Additional Cups (Top-Up)",
    description: "Designed for large events, corporate functions, and high-footfall activations.",
    image: cupImg4
  }
];

export default function CoffeePackages() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.mainTitle}>Choose Your Coffee Package</h2>
        <p className={styles.subtitle}>
          From intimate gatherings to large-scale events, pick a package based on your guest 
          count and serving needs. Simple, flexible, and crafted to keep every cup consistent.
        </p>
      </header>

      <div className={styles.grid}>
        {packages.map((pkg) => (
          <div key={pkg.id} className={styles.card}>
            <div className={styles.cardContent}>
              
              <div className={styles.textGroup}>
              
                <h3 className={`${styles.cardTitle} ${styles.desktopOnly}`}>{pkg.title}</h3>
                <h3 className={`${styles.cardTitle} ${styles.mobileOnly}`}>30 Cups Package</h3>    {/* --- Mobile view --- */}
                
               
                <p className={`${styles.cardDescription} ${styles.desktopOnly}`}>
                  {pkg.description}
                </p>
                <p className={`${styles.cardDescription} ${styles.mobileOnly}`}>
                  Perfect for small meetings, intimate celebrations, or quick pop-ups.   {/* --- Mobile view --- */}
                </p>
              </div>

              <a href="#enquiry-form" className={styles.link}>
                Enquire Now 
                <span className={styles.arrow}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.351292 7.57668L7.3504 0.505443M7.3504 0.505443V6.86956M7.3504 0.505443H1.0512" stroke="#C4754E"/>
                  </svg>
                </span>
              </a>
            </div>

            <div className={styles.imageWrapper}>
              <Image 
                src={pkg.image} 
                alt={pkg.title} 
                className={styles.cupImage} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}