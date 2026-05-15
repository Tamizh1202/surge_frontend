"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Stories.module.css";

import story1 from "../Stories/story1.webp";
import story2 from "./story2.webp";
import story3 from "../Stories/story3.webp";
import Link from "next/link";

const IMAGES = [story1, story2, story3];
const TOTAL  = IMAGES.length;
const DUR    = 1.1;          // seconds (GSAP)
const GAP    = 3000;         // ms between rotations
const SLIDE  = 260;          // px — matches frame width
const EASE   = "power2.inOut";

/*
 * safeX — parking position for winL's waiting element.
 *
 * An inner div (260px wide, transform-origin center) at scale S overflows
 * its own left edge by:  (260/2) × (S − 1)
 * Parking at x = SLIDE + (SLIDE/2) × (S − 1) means the inner's left edge
 * lands exactly on the frame's right boundary → zero bleed before animation.
 *
 * winL's incoming element now starts at scale 1.5 (see rotate()), so it must
 * park at safeX(1.5) = 260 + 130 × 0.5 = 325. Kept as a function so the
 * offset always tracks whatever start-scale the left window uses.
 */
function safeX(fromScale) { return SLIDE + (SLIDE / 2) * (fromScale - 1); }

function mod(n, m) { return ((n % m) + m) % m; }

export default function AboutSection() {
  const cur  = useRef(0);
  const busy = useRef(false);
  const winL = useRef(null);
  const winC = useRef(null);
  const winR = useRef(null);

  /* ── element factory ── */
  function makeEl(idx, scaleVal) {
    const i = mod(idx, TOTAL);
    const wrap  = document.createElement("div");
    wrap.style.cssText = "position:absolute;inset:0;";
    const inner = document.createElement("div");
    inner.style.cssText = "position:absolute;inset:0;transform-origin:center center;";
    gsap.set(inner, { scale: scaleVal });
    const img = document.createElement("img");
    img.src    = IMAGES[i].src;
    img.alt    = "Surge Story";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
    inner.appendChild(img);
    wrap.appendChild(inner);
    return wrap;
  }

  /* ── populate a frame with [current, next] ── */
  function buildWindow(winEl, curIdx, nxtIdx, curScale, nxtScale, nxtX) {
    winEl.innerHTML = "";
    const curEl = makeEl(curIdx, curScale); gsap.set(curEl, { x: 0 });
    const nxtEl = makeEl(nxtIdx, nxtScale); gsap.set(nxtEl, { x: nxtX });
    winEl.appendChild(curEl);
    winEl.appendChild(nxtEl);
  }

  /* ── initial state ── */
  function init() {
    const c = cur.current;
    // winL's incoming element starts at scale 1.5 → park at safeX(1.5)
    buildWindow(winL.current, mod(c - 1, TOTAL), mod(c,     TOTAL), 1.0, 1.5, safeX(1.5));
    buildWindow(winC.current, mod(c,     TOTAL),  mod(c + 1, TOTAL), 1.5, 1.0, SLIDE);
    buildWindow(winR.current, mod(c + 1, TOTAL),  mod(c + 2, TOTAL), 1.0, 1.0, SLIDE);
  }

  /*
   * ── animate a single frame ──
   *
   * current → always exits  to x = -SLIDE
   * next    → always enters  to x = 0      (works for any starting x)
   *
   * nxtFromScale: if provided, uses fromTo on the incoming element so the
   * start-scale is applied atomically at tween-start — no standalone
   * gsap.set that could flash a scaled element into view before movement.
   */
  function animateFrame(winEl, curScaleEnd, nxtScaleEnd, nxtFromScale) {
    const ch = [...winEl.children];

    if (ch[0]) {
      gsap.to(ch[0],                     { x: -SLIDE,       duration: DUR, ease: EASE });
      gsap.to(ch[0].querySelector("div"), { scale: curScaleEnd, duration: DUR, ease: EASE });
    }
    if (ch[1]) {
      gsap.to(ch[1], { x: 0, duration: DUR, ease: EASE });
      const inner = ch[1].querySelector("div");
      if (nxtFromScale !== undefined) {
        gsap.fromTo(inner, { scale: nxtFromScale }, { scale: nxtScaleEnd, duration: DUR, ease: EASE });
      } else {
        gsap.to(inner, { scale: nxtScaleEnd, duration: DUR, ease: EASE });
      }
    }
  }

  /* ── main rotation ── */
  function rotate() {
    if (busy.current) return;
    busy.current = true;

    // winL incoming now mirrors the center's featured zoom-out exactly:
    // fromTo(1.5 → 1.2) — same curve as winC's outgoing element. It settles
    // 1.2 → 1.0 on its *next* rotation (as it slides out), before resting.
    animateFrame(winL.current, 1.0, 1.2, 1.5); // incoming: fromTo(1.5 → 1.2) — matches center
    animateFrame(winC.current, 1.2, 1.5);       // outgoing: 1.5→1.2 | incoming: 1.0→1.5
    animateFrame(winR.current, 1.5, 1.0);       // outgoing: 1.0→1.5 | incoming: 1.0→1.0

    setTimeout(() => {
      cur.current = mod(cur.current + 1, TOTAL);
      const c = cur.current;

      function refresh(winEl, nxtIdx, nxtX, nxtScale) {
        winEl.children[0].remove();
        gsap.set(winEl.children[0], { x: 0 });
        const nxtEl = makeEl(nxtIdx, nxtScale);
        gsap.set(nxtEl, { x: nxtX });
        winEl.appendChild(nxtEl);
      }

      // winL's freshly-added waiting element starts at scale 1.5, parked at safeX(1.5)
      refresh(winL.current, mod(c,     TOTAL), safeX(1.5), 1.5);
      refresh(winC.current, mod(c + 1, TOTAL), SLIDE,      1.0);
      refresh(winR.current, mod(c + 2, TOTAL), SLIDE,      1.0);
      busy.current = false;
    }, DUR * 1000 + 80);
  }

  useEffect(() => {
    init();
    const interval = setInterval(rotate, GAP);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.layoutWrapper}>
        <div className={styles.textStack}>
          <h2 className={styles.title}>Built in Dubai, Brewed with Purpose</h2>
          <p className={styles.description}>
            Surge is an Emirati-owned specialty coffee brand driven by quality,
            authenticity, and community. Since 2016, we&apos;ve been crafting coffee
            experiences inspired by global standards and elevated by local
            values—bringing culture and creativity into every cup.
          </p>
          <button className={styles.button}>
            <Link href="/about-us">Explore About Us</Link>
          </button>
        </div>

        <div className={styles.imageFlexContainer}>
          <div ref={winL} className={`${styles.frame} ${styles.frameLeft}`} />
          <div ref={winC} className={`${styles.frame} ${styles.frameCenter}`} />
          <div ref={winR} className={`${styles.frame} ${styles.frameRight}`} />
        </div>
      </div>
    </section>
  );
}