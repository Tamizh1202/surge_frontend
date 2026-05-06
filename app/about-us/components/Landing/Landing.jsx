import styles from './Landing.module.css';
import Image from "next/image";
import surgeImg from "./surge.png";

export default function Landing() {
  return (
    <section className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>Crafted for coffee <br /> that matters</h2>
          <p className={styles.description}>
            At Surge, specialty coffee is more than a drink, it's a crafted
            experience rooted in quality, precision, and community.
            Since 2016, we've blended global expertise with local
            values to elevate every cup.
          </p>
          <a href="#our-mission" className={styles.exploreBtn}>Explore About Us</a>
        </div>
      </div>

      <div className={styles.middle}>
        <Image
          src={surgeImg}
          alt="surge"
          width={300}
          height={400}
          className={styles.product}
          priority
        />
      </div>

      <div className={styles.rightvideo}>
        <video 
          width="300" 
          height="400" 
          autoPlay 
          loop 
          muted 
          playsInline
          className={styles.videoPlayer}
        >
          {/* Public folder ke liye seedha '/' use hota hai */}
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}