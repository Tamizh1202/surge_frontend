"use client";
import { useLayoutEffect, useRef } from "react";
import styles from "./Mission.module.css";
import Image from "next/image";
import storyImg from "./story.png";

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
       end: window.innerWidth < 900 ? "+=150%" : `+=${cards.length * 60}%`,
          pin: true,
          scrub: 1,
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
      tl.to({}, { duration: 1 });
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
              Surge is an Emirati-owned specialty coffee brand driven by passion
              for quality, authenticity, and community. Our spaces are designed to
              feel welcoming, familiar, and distinctly local where every visit
              feels like your place.
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
                To deliver consistently exceptional coffee experiences while staying true  to our local heritage, elevating every cup with purpose, pride, and  precision.
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
                To become the leading Emirati specialty coffee brand recognized for  excellence, authenticity, and innovation both locally and beyond
              </p>
              <div className={styles.number}>02</div>
            </div>

            {/* Card 03 */}
            <div
              ref={(el) => (cardsRef.current[2] = el)}
              className={`${styles.card} ${styles.grayCard}`}
            >
              <h1 className={styles.text}>Sugre Approach</h1>
              <p className={styles.content}>
                At Surge, we blend global specialty coffee standards with Dubai’s local spirit. Every cup is crafted with premium beans, served with consistency, and designed to bring people together because coffee is more than a drink, it’s a daily experience.
              </p>
              <div className={styles.number}>03</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}