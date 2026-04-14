"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Stories.module.css';

import story1 from '../Stories/story1.jpg';
import story2 from './story2.png';
import story3 from '../Stories/story3.jpg';

const IMAGES = [story1, story2, story3];

const AboutSection = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const total = IMAGES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex(prev => {
        setPrevIndex(prev);
        return (prev + 1) % total;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [total]);

  const get = (offset) => ((centerIndex + offset) % total + total) % total;

  const getImgClass = (i, activeIndex) => {
    if (i === activeIndex) return styles.imgVisible;
    if (i === prevIndex) return styles.imgExit;
    return styles.imgHidden;
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

          <div className={`${styles.imageSlot} ${styles.sideSlot}`}>
            {IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Surge Story"
                fill
                className={`${styles.storyImg} ${styles.sideImg} ${getImgClass(i, get(-1))}`}
              />
            ))}
          </div>

          <div className={`${styles.imageSlot} ${styles.centerSlot}`}>
            {IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Surge Story"
                fill
                className={`${styles.storyImg} ${styles.centerImg} ${getImgClass(i, get(0))}`}
              />
            ))}
          </div>

          <div className={`${styles.imageSlot} ${styles.sideSlot}`}>
            {IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Surge Story"
                fill
                className={`${styles.storyImg} ${styles.sideImg} ${getImgClass(i, get(1))}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;