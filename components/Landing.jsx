import Image from "next/image";
import styles from "./Landing.module.css";
import Link from 'next/link';
export default function HomePage() {
  return (
    <section className={styles.hero}>

      <Image
        src="/surge.png"
        alt="Coffee Hero"
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.monotoneNoiseEffect}></div>

      <p className={styles.heroText}>
      Precision-crafted. Intentionally served. Designed to bring people together — because at Surge, great coffee is never just a drink.
      </p>


      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
           Where Dubai's <span className={styles.spantext} >Coffee</span> <br />
          <span className={styles.spantext} >Standard Get's</span> Raised
        </h1>

        <button className={styles.shopButton}>
          <Link href="/shop/coffee-beans">Shop Now</Link>
        </button>
        <button className={styles.mobileBtn}>
          <Link href="/shop/coffee-beans">Explore All</Link>
        </button>
      </div>
    </section>
  );
}