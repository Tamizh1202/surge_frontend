"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Stories.module.css';

import story1 from '../Stories/story1.jpg';
import story2 from './story2.png';
import story3 from '../Stories/story3.jpg';

const IMAGES = [story1, story2, story3, story1, story2, story3];

const AboutSection = () => {
  const [centerIndex, setCenterIndex] = useState(1);
  const [ready, setReady] = useState(false);
  const total = IMAGES.length;

  useEffect(() => {
    setReady(true);
    const interval = setInterval(() => {
      setCenterIndex(prev => (prev + 1) % total);
    }, 2000);
    return () => clearInterval(interval);
  }, [total]);

  const getSlotType = (idx) => {
    const diff = ((idx - centerIndex) % total + total) % total;
    const normalized = diff > total / 2 ? diff - total : diff;
    if (normalized === 0) return 'center';
    if (Math.abs(normalized) === 1) return 'side';
    return 'hidden';
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.layoutWrapper}>
        <div className={styles.textStack}>
          <h2 className={styles.title}>Built in Dubai, Brewed with Purpose</h2>
          <p className={styles.description}>
            Surge is an Emirati-owned specialty coffee brand driven by quality,
            authenticity, and community. Since 2016, we've been crafting coffee
            experiences inspired by global standards and elevated by local
            values—bringing culture and creativity into every cup.
          </p>
          <button className={styles.button}>Explore About Us</button>
        </div>

        <div className={styles.imageFlexContainer}>
          {IMAGES.map((src, idx) => {
            const slotType = getSlotType(idx);
            return (
              <div
                key={idx}
                className={`${styles.imageSlot} ${!ready ? styles.noTransition : ''} ${
                  slotType === 'center' ? styles.centerSlot :
                  slotType === 'side'   ? styles.sideSlot   :
                                          styles.hiddenSlot
                }`}
              >
                <Image
                  src={src}
                  alt="Surge Story"
                  fill
                  className={styles.storyImg}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;