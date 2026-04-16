"use client";

import Image from "next/image";
import styles from "./Exploreabout.module.css";
import merchImg from "./merch.png";
import eventsImg from "./events.png";
import Link from "next/link";
export default function Exploreabout() {
  return (
    <section className={styles.exploreSection}>
      <div className={styles.gridContainer}>


        <div className={styles.exploreCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={merchImg}
              alt="Surge Merchandise"
              fill
              className={styles.cardImage}
            />


            <div className={styles.textBox}>
              <h2>Surge Merchandise</h2>
              <p>
                Go beyond the cup. Discover brewing tips, café moments, and behind-the-scenes stories from our roasters and baristas. From practical how-tos to seasonal highlights, each article brings you closer to the craft of great coffee.
              </p>
              <Link href="/shop/merchandise">
                <button className={styles.btn}>Buy Now</button></Link>
            </div>
          </div>
        </div>

        <div className={styles.exploreCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={eventsImg}
              alt="Surge Events"
              fill
              className={styles.cardImage}
            />


            <div className={styles.textBox}>
              <h2>Surge Events</h2>
              <p>
                At Surge, our events are crafted around exceptional catering experiences. From intimate gatherings to large celebrations, we deliver thoughtfully prepared food and beverages that elevate every occasion.
              </p>
              <Link href="/events">
              <button className={styles.btn}>Plan an Event</button></Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}