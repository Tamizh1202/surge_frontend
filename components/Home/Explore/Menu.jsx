"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Menu.module.css";
import breakfast from "./Menu1.webp";
import breads from "./Menu2.webp";
import beverages from "./Menu3.webp";
import desserts from "./Menu4.webp";

const MobileArrow = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75 8.75L8.75 0.75M8.75 0.75H0.75M8.75 0.75V8.75" stroke="#414343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const menuItems = [
  { title: "Coffee & Beverages", img: breakfast, desc: "Fresh plate to ease you into the day.", link: "/ourmenu" },
  { title: "Bakery & Breakfast", img: breads, desc: "Baked daily, crafted with care.", link: "/ourmenu" },
  { title: "Healthy & Fresh", img: beverages, desc: "Exceptional coffee, every single cup.", link: "/ourmenu" },
  { title: "Lifestyle & Specials", img: desserts, desc: "Small-batch sweet worth lingering over.", link: "/ourmenu" },
];

export default function Menu() {
  const router = useRouter();

  const handleCardClick = () => {
    if (window.innerWidth <= 1200) {
      router.push("/ourmenu");
    }
  };

  return (
    <section className={styles.menuSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.heading}>Explore our Menu</h2>
          <p className={styles.subtext}>
            From espresso classics to signature bites — Surge is far more than beans. Explore what's crafted fresh daily across our Dubai cafés.
          </p>
        </div>
      </div>

      <div className={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={handleCardClick}
          >
            <div className={styles.imageWrapper}>
              <Image src={item.img} alt={item.title} className={styles.image} fill />
            </div>

            <div className={styles.contentStack}>
              <div className={styles.cardTitle}>
                <span>{item.title}</span>
                <div className={styles.mobileOnlyArrow}>
                  <MobileArrow />
                </div>
              </div>

              <div className={styles.hoverContent}>
                <div className={styles.hoverInner}>
                  <p className={styles.overlayTitle}>{item.desc}</p>
                  <Link href="/ourmenu" className={styles.exploreLink} onClick={(e) => e.stopPropagation()}>
                    Explore Now
                    <span className={styles.arrowIcon}>
                      <svg width="10" height="10" viewBox="0 0 8 8" fill="none">
                        <path d="M0.351292 7.57668L7.3504 0.505443M7.3504 0.505443V6.86956M7.3504 0.505443H1.0512" stroke="#C4754E" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
