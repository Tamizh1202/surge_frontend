import Image from "next/image";
import styles from "./Landing.module.css";

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
        Every cup is crafted with premium beans, served with consistency,
        and designed to bring people together because coffee is more 
        than a drink.
      </p>

    
      <div className={styles.heroContent}>
<h1 className={styles.heroTitle}>
          Not your <span className={styles.spantext} >intresting</span> <br />
          <span className={styles.spantext} >coffee</span> brewery 
        </h1>
        
        <button className={styles.shopButton}>
          Shop Now
        </button>
        <button className={styles.mobileBtn}>
    Explore All
  </button>
      </div>
    </section>
  );
}