"use client";
import { useEffect, useRef } from "react";
import styles from "./Mission.module.css";
import Image from "next/image";
import storyImg from "./story.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Mission() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current.filter(Boolean);
    let ctx;

    const setupCtx = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(max-width: 900px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=170%",
              pin: true,
              scrub: 0.8,
              pinSpacing: false,   // ← add this
              invalidateOnRefresh: true,
            },
          });
          cards.forEach((card, index) => {
            if (index === 0) return;
            tl.fromTo(
              card,
              { yPercent: 120, opacity: 0 },
              { yPercent: -50, opacity: 1, ease: "none", duration: 1, force3D: false },
              index - 1
            );
          });
        });

        mm.add("(min-width: 901px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${cards.length * 100}%`,
              pin: true,
              scrub: 0.8,
              // markers: true,
              pinSpacing: true,
              // onUpdate: (self) => console.log(self.progress),
              invalidateOnRefresh: true,
            },
          });
          cards.forEach((card, index) => {
            if (index === 0) return;
            tl.fromTo(
              card,
              { yPercent: 120, opacity: 0 },
              { yPercent: -50, opacity: 1, ease: "none", duration: 1 },
              index - 1
            );
          });
          tl.to({}, { duration: 0.3 });
        });
      }, containerRef);
    };

    // Wait for full page load including all assets, then single refresh
    const init = () => {
      // Double RAF ensures browser has painted and layout is truly settled
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setupCtx();
          ScrollTrigger.refresh();
        });
      });
    };

    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init, { once: true });
    }

    return () => {
      window.removeEventListener("load", init);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div id="our-mission">
      <section ref={containerRef} className={styles.landContainer}>
        <div className={styles.right}>
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
              Surge is an Emirati-owned specialty coffee brand driven by an
              unwavering passion for quality, authenticity, and community. Our
              spaces are designed to feel welcoming, familiar, and distinctly
              local — a place that always feels like yours.
            </p>
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.cardcontainer}>
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              className={`${styles.card} ${styles.grayCard}`}
            >
              <h1 className={styles.text}>Our Mission</h1>
              <p className={styles.content}>
                To deliver consistently exceptional coffee experiences while
                honouring our local heritage — elevating every cup with purpose,
                pride, and precision.
              </p>
              <div className={styles.number}>01</div>
            </div>

            <div
              ref={(el) => (cardsRef.current[1] = el)}
              className={`${styles.card} ${styles.penchCard}`}
            >
              <h1 className={styles.text}>Our Vision</h1>
              <p className={styles.content}>
                To become the leading Emirati specialty coffee brand — recognised
                for excellence, authenticity, and innovation, both locally and
                across the region.
              </p>
              <div className={styles.number}>02</div>
            </div>

            <div
              ref={(el) => (cardsRef.current[2] = el)}
              className={`${styles.card} ${styles.grayCard}`}
            >
              <h1 className={styles.text}>Surge Approach</h1>
              <p className={styles.content}>
                At Surge, we marry global specialty coffee standards with the
                vibrant spirit of Dubai. Every cup is crafted with premium beans,
                served with precision, and designed to bring people together —
                because great coffee isn't just a drink, it's a daily ritual.
              </p>
              <div className={styles.number}>03</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}