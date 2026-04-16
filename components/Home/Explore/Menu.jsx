import Image from "next/image";
import Link from "next/link";
import styles from "./Menu.module.css";
import breakfast from "./Menu1.png";
import breads from "./Menu2.png";
import beverages from "./Menu3.png";
import desserts from "./Menu4.png";

const MobileArrow = () => (
  <svg 
    className={styles.mobileArrow} 
    width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const menuItems = [
  { title: "Breakfast", img: breakfast, desc: "Fresh plate to ease you into the day.", link: "/breakfast" },
  { title: "Breads", img: breads, desc: "Baked daily, crafted with care.", link: "/breads" },
  { title: "Beverages", img: beverages, desc: "Exceptional coffee, every single cup.", link: "/beverages" },
  { title: "Desserts", img: desserts, desc: "Small-batch sweet worth lingering over.", link: "/desserts" },
];

export default function Menu() {
  return (
    <section className={styles.menuSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.heading}>Explore our Menu</h2>
          <p className={styles.subtext}>
            From espresso classics to signature drinks and bites. Surge is more
            than beans. Discover what’s served daily at our Dubai cafés.
          </p>
        </div>

        <Link href="ourmenu" className={styles.viewMenu}>
          <span>View Menu</span>
          <div className={styles.arrowBox}>
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </Link>
      </div>

      <div className={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image src={item.img} alt={item.title} className={styles.image} fill />
            </div>
          
          

            <div className={styles.contentStack}>
              <div className={styles.cardTitle}>
                <span>{item.title}</span>
                <MobileArrow />
              </div>

                   {/* upadted */}
              <div className={styles.hoverContent}>
                <p className={styles.overlayTitle}>{item.desc}</p>
                <Link href="/ourmenu" className={styles.exploreLink}>
                  Explore Now 
                  <span className={styles.arrowIcon}>
                    <svg width="10" height="10" viewBox="0 0 8 8" fill="none">
                      <path d="M0.351292 7.57668L7.3504 0.505443M7.3504 0.505443V6.86956M7.3504 0.505443H1.0512" stroke="#C4754E"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}