"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./Stories.module.css";

import story1 from "../Stories/story1.jpg";
import story2 from "./story2.png";
import story3 from "../Stories/story3.jpg";

const IMAGES = [story1, story2, story3];
const ROTATE_MS = 2800;
const PARALLAX_PX = 40; // how far the inner layer shifts (tweak to taste)

const AboutSection = () => {
  const total = IMAGES.length;
  const [centerIndex, setCenterIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  // Parallax offset animated with requestAnimationFrame for smoothness
  // Each slot gets its own animated value: [left, center, right]
  const parallaxTargets = useRef([0, 0, 0]);
  const parallaxCurrent = useRef([0, 0, 0]);
  const layerRefs = useRef([null, null, null]);
  const rafRef = useRef(null);

  // ── Smooth parallax animation loop ────────────────────────────────
  const animateParallax = useCallback(() => {
    for (let i = 0; i < 3; i++) {
      const target = parallaxTargets.current[i];
      const current = parallaxCurrent.current[i];
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        parallaxCurrent.current[i] += diff * 0.12;
      } else {
        parallaxCurrent.current[i] = target;
      }

      const el = layerRefs.current[i];
      if (el) {
        el.style.transform = `translateX(${parallaxCurrent.current[i]}px)`;
      }
    }

    rafRef.current = requestAnimationFrame(animateParallax);
  }, []);

  // ── Kick off parallax whenever centerIndex changes ────────────────
  useEffect(() => {
    // Nudge the current position forward, then let it ease back to 0.
    // This creates a single smooth drift in one direction — no back-and-forth.
    for (let i = 0; i < 3; i++) {
      parallaxCurrent.current[i] += PARALLAX_PX;
      parallaxTargets.current[i] = 0;
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animateParallax);

    return () => cancelAnimationFrame(rafRef.current);
  }, [centerIndex, animateParallax]);

  // ── Auto-rotate ───────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % total;
      });
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [total]);

  // ── Helpers ───────────────────────────────────────────────────────
  const get = (offset) => ((centerIndex + offset) % total + total) % total;

  const getImgClass = (imgIdx, activeIdx) => {
    if (imgIdx === activeIdx) return styles.imgVisible;
    if (imgIdx === prevIndex) return styles.imgExit;
    return styles.imgHidden;
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.layoutWrapper}>
        <div className={styles.textStack}>
          <h2 className={styles.title}>
            Built in Dubai, Brewed with Purpose
          </h2>
          <p className={styles.description}>
            Surge is an Emirati-owned specialty coffee brand driven by quality,
            authenticity, and community. Since 2016, we've been crafting coffee
            experiences inspired by global standards and elevated by local
            values—bringing culture and creativity into every cup.
          </p>
          <button className={styles.button}>Explore About Us</button>
        </div>

        <div className={styles.imageFlexContainer}>
          {/* Left slot */}
          <div className={`${styles.imageSlot} ${styles.sideSlot}`}>
            <div
              className={styles.parallaxLayer}
              ref={(el) => (layerRefs.current[0] = el)}
            >
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
          </div>

          {/* Center slot */}
          <div className={`${styles.imageSlot} ${styles.centerSlot}`}>
            <div
              className={styles.parallaxLayer}
              ref={(el) => (layerRefs.current[1] = el)}
            >
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
          </div>

          {/* Right slot */}
          <div className={`${styles.imageSlot} ${styles.sideSlot}`}>
            <div
              className={styles.parallaxLayer}
              ref={(el) => (layerRefs.current[2] = el)}
            >
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
      </div>
    </section>
  );
};

export default AboutSection;