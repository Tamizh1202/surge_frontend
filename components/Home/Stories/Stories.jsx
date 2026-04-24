"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Stories.module.css";

import story1 from "../Stories/story1.jpg";
import story2 from "./story2.png";
import story3 from "../Stories/story3.jpg";

const IMAGES = [story1, story2, story3];
const ROTATE_MS = 2800;
const SLIDE_MS  = 850;
const EASE = `${SLIDE_MS}ms cubic-bezier(0.4,0,0.2,1)`;

function mod(n, m) { return ((n % m) + m) % m; }

export default function AboutSection() {
  const total   = IMAGES.length;
  const cur     = useRef(0);
  const busy    = useRef(false);

  const flTop   = useRef(null);
  const fcTop   = useRef(null);
  const frTop   = useRef(null);

  const flTopImg = useRef(null);
  const flBotImg = useRef(null);
  const fcTopImg = useRef(null);
  const fcBotImg = useRef(null);
  const frTopImg = useRef(null);
  const frBotImg = useRef(null);

  // set src on an img ref safely
  const setSrc = (ref, imgSrc) => {
    if (ref.current) ref.current.src = imgSrc.src ?? imgSrc;
  };

  // initial paint
  useEffect(() => {
    const C = cur.current;
    setSrc(flTopImg, IMAGES[mod(C - 1, total)]);
    setSrc(flBotImg, IMAGES[mod(C + 2, total)]);
    setSrc(fcTopImg, IMAGES[mod(C,     total)]);
    setSrc(fcBotImg, IMAGES[mod(C + 1, total)]);
    setSrc(frTopImg, IMAGES[mod(C + 1, total)]);
    setSrc(frBotImg, IMAGES[mod(C + 2, total)]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (busy.current) return;
      busy.current = true;

      const C    = cur.current;
      const next = mod(C + 1, total);
      const nn   = mod(C + 2, total);
      const nnn  = mod(C + 3, total);

      // 1. slide all tops left together
      [flTop, frTop].forEach(r => {
        r.current.style.transition = `transform ${EASE}`;
        r.current.style.transform  = 'translateX(-100%)';
      });
      fcTop.current.style.transition = `transform ${EASE}`;
      fcTop.current.style.transform  = 'translateX(-100%) scale(1.15)';

      setTimeout(() => {
        cur.current = next;

        // 2. snap back, no transition
        [flTop, fcTop, frTop].forEach(r => {
          r.current.style.transition = 'none';
          r.current.style.transform  = 'translateX(0) scale(1.15)';
        });

        // 3. load new images
        setSrc(flTopImg, IMAGES[mod(next - 1, total)]);
        setSrc(flBotImg, IMAGES[nnn]);
        setSrc(fcTopImg, IMAGES[next]);
        setSrc(fcBotImg, IMAGES[nn]);
        setSrc(frTopImg, IMAGES[nn]);
        setSrc(frBotImg, IMAGES[nnn]);

        // 4. zoom center in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fcTop.current.style.transition = `transform ${EASE}`;
            fcTop.current.style.transform  = 'translateX(0) scale(1)';
            // left and right settle without zoom
            flTop.current.style.transition = 'none';
            flTop.current.style.transform  = 'translateX(0)';
            frTop.current.style.transition = 'none';
            frTop.current.style.transform  = 'translateX(0)';
            setTimeout(() => { busy.current = false; }, SLIDE_MS + 50);
          });
        });
      }, SLIDE_MS);

    }, ROTATE_MS);

    return () => clearInterval(interval);
  }, [total]);

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

          {/* LEFT frame */}
          <div className={`${styles.frame} ${styles.frameLeft}`}>
            <div className={styles.botLayer}>
              <img ref={flBotImg} alt="" className={styles.storyImg} />
            </div>
            <div className={styles.topLayer} ref={flTop}>
              <img ref={flTopImg} alt="Surge Story" className={styles.storyImg} />
            </div>
          </div>

          {/* CENTER frame */}
          <div className={`${styles.frame} ${styles.frameCenter}`}>
            <div className={styles.botLayer}>
              <img ref={fcBotImg} alt="" className={styles.storyImg} />
            </div>
            <div className={styles.topLayer} ref={fcTop}>
              <img ref={fcTopImg} alt="Surge Story" className={styles.storyImg} />
            </div>
          </div>

          {/* RIGHT frame */}
          <div className={`${styles.frame} ${styles.frameRight}`}>
            <div className={styles.botLayer}>
              <img ref={frBotImg} alt="" className={styles.storyImg} />
            </div>
            <div className={styles.topLayer} ref={frTop}>
              <img ref={frTopImg} alt="Surge Story" className={styles.storyImg} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}