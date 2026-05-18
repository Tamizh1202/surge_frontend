"use client";
import { useLayoutEffect, useRef } from "react";
import styles from "./Mission.module.css";
import Image from "next/image";
import storyImg from "./story.webp";

//import//
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const cards = cardsRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
       end: window.innerWidth < 900 ? "+=150%" : `+=${cards.length * 30}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,

          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        tl.fromTo(
          card,
          {
            yPercent: 120,
            opacity: 0,
          },
          {
            yPercent: -50,
            opacity: 1,
            ease: "none",
            duration: 1,

            force3D: false,
          },
          index - 1
        );
      });
    
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="our-mission">
      <section ref={containerRef} className={styles.landContainer} >
        <div className={styles.right} >

          <Image
            src={storyImg}
            alt="surge"
            width={777}
            height={647}
            className={styles.product}
            priority
          />
          <div className={styles.textcontent}>
            <h1 className={styles.storytitle}>Our Story</h1>
            <p className={styles.story}>
            Surge is an Emirati-owned specialty coffee brand driven by an unwavering passion for quality, authenticity, and community. Our spaces are designed to feel welcoming, familiar, and distinctly local — a place that always feels like yours.
            </p>
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.cardcontainer}>
            {/* Card 01 */}
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              className={`${styles.card} ${styles.grayCard}`}
            >
              <h1 className={styles.text}>Our Mission</h1>
              <p className={styles.content}>
              To deliver consistently exceptional coffee experiences while honouring our local heritage — elevating every cup with purpose, pride, and precision.
              </p>
              <div className={styles.number}>01</div>
            </div>

            {/* Card 02 */}
            <div
              ref={(el) => (cardsRef.current[1] = el)}
              className={`${styles.card} ${styles.penchCard}`}
            >
              <h1 className={styles.text}>Our Vision </h1>
              <p className={styles.content}>
               To become the leading Emirati specialty coffee brand — recognised for excellence, authenticity, and innovation, both locally and across the region.
              </p>
              <div className={styles.number}>02</div>
            </div>

            {/* Card 03 */}
            <div
              ref={(el) => (cardsRef.current[2] = el)}
              className={`${styles.card} ${styles.grayCard}`}
            >
              <h1 className={styles.text}>Surge Approach</h1>
              <p className={styles.content}>
             At Surge, we marry global specialty coffee standards with the vibrant spirit of Dubai. Every cup is crafted with premium beans, served with precision, and designed to bring people together — because great coffee isn't just a drink, it's a daily ritual.
              </p>
              <div className={styles.number}>03</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}