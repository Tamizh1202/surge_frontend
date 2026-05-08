import styles from './Enquire.module.css';
import Image from "next/image";

import cupImg from './Enq1.png';
import cupImg2 from './Enq2.png';
import cupImg3 from './Enq4.png';

const packages = [
  {
    id: 1,
    title: "Tell Us About Your Event",
    description: "Share your event date, time, location, and guest count. Well recommend the perfect coffee setup for your occasion.",
    image: cupImg
  },
  {
    id: 2,
    title: "Choose Your Package",
    description: "Choose a cups package and tailor it with add-ons to suit your event. Flexible setups designed to match your guest count and style.",
    image: cupImg2
  },
  {
    id: 3,
    title: "We Handle the Rest",
    description: "Our team arrives on time, sets up a clean and professional coffee station, and serves freshly brewed beverages throughout your event.",
    image: cupImg3
  },
];

export default function CoffeePackages() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.mainTitle}>How it Works</h2>
        <p className={styles.subtitle}>
          Simple steps. Seamless coffee experience.
        </p>
      </header>

      <div className={styles.grid}>
        {/* The 3 mapped beige cards */}
        {packages.map((pkg) => (
          <div key={pkg.id} className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{pkg.title}</h3>
              <p className={styles.cardDescription}>{pkg.description}</p>
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


        <div className={styles.cardBox}>
          <p className={styles.cardText}>Ready to elevate your  event?</p>
          <a href="#enquiry-form" className={styles.enquireLink}>
            Enquire Now
            <span className={styles.arrowIcon}>
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.351292 7.57668L7.3504 0.505443M7.3504 0.505443V6.86956M7.3504 0.505443H1.0512" stroke="white" strokeWidth="1.2" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}