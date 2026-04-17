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
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Parallax offset animated with requestAnimationFrame for smoothness
  // Each slot gets its own animated value: [left, center, right]
  const parallaxTargets = useRef([0, 0, 0]);
  const parallaxCurrent = useRef([0, 0, 0]);
  const layerRefs = useRef([null, null, null]);
  const rafRef = useRef(null);

  // ── Smooth parallax animation loop ────────────────────────────────
  const animateParallax = useCallback(() => {
    let needsUpdate = false;

    for (let i = 0; i < 3; i++) {
      const target = parallaxTargets.current[i];
      const current = parallaxCurrent.current[i];
      const diff = target - current;

      if (Math.abs(diff) > 0.1) {
        // Ease toward target (lower = smoother/slower)
        parallaxCurrent.current[i] += diff * 0.04;
        needsUpdate = true;
      } else {
        parallaxCurrent.current[i] = target;
      }

      const el = layerRefs.current[i];
      if (el) {
        el.style.transform = `translateX(${parallaxCurrent.current[i]}px)`;
      }
    }

    if (needsUpdate) {
      rafRef.current = requestAnimationFrame(animateParallax);
    }
  }, []);

  // ── Kick off parallax whenever centerIndex changes ────────────────
  useEffect(() => {
    // When rotating forward, images conceptually move LEFT,
    // so we shift the parallax layer to the RIGHT (positive) to create depth,
    // then ease it back to 0.
    const shift = direction * PARALLAX_PX;

    // Set all three slots to the same initial offset
    for (let i = 0; i < 3; i++) {
      parallaxCurrent.current[i] = shift;
      parallaxTargets.current[i] = 0; // ease back to neutral
    }

    // Start animation
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animateParallax);

    return () => cancelAnimationFrame(rafRef.current);
  }, [centerIndex, direction, animateParallax]);

  // ── Auto-rotate ───────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
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