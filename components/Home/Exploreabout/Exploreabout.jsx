"use client";

import Image from "next/image";
import styles from "./Exploreabout.module.css";
import merchImg from "./merch.webp";
import eventsImg from "./events.webp";
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
              Go beyond the cup. Wear the ritual. Surge merchandise is designed for those who live and breathe exceptional coffee culture — carry the craft wherever you go.
              </p>
              <Link href="/shop/merchandise" style={{ textDecoration: 'none' }}>
                <button className={styles.btn}>Buy Now</button>
              </Link>
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
At Surge, every event is an experience in its own right. From intimate gatherings to grand celebrations across Dubai, we deliver flawlessly curated coffee and food that elevate every moment.
              </p>
              <Link href="/events" style={{ textDecoration: 'none' }}>
                <button className={styles.btn}>Plan an Event</button></Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}