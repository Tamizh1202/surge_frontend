"use client";
import { useEffect, useRef } from "react";
import styles from "./Stories.module.css";

import story1 from "../Stories/story1.jpg";
import story2 from "./story2.png";
import story3 from "../Stories/story3.jpg";

const IMAGES = [story1, story2, story3];
const TOTAL = IMAGES.length;
const DUR = 1100;
const GAP = 3000;

function mod(n, m) { return ((n % m) + m) % m; }

export default function AboutSection() {
  const cur = useRef(0);
  const busy = useRef(false);
  const winL = useRef(null);
  const winC = useRef(null);
  const winR = useRef(null);

  function makeEl(idx, scaleVal) {
    const i = mod(idx, TOTAL);
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;inset:0;';
    const inner = document.createElement('div');
    inner.style.cssText = `
      position:absolute;inset:0;
      transform-origin:center center;
      transform:scale(${scaleVal});
    `;
    const img = document.createElement('img');
    img.src = IMAGES[i].src;
    img.alt = 'Surge Story';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    inner.appendChild(img);
    wrap.appendChild(inner);
    return wrap;
  }

  function buildWindow(winEl, curIdx, nextIdx, curScale, nxtScale) {
    winEl.innerHTML = '';
    const curEl = makeEl(curIdx, curScale);
    curEl.style.transform = 'translateX(0px)';
    const nxtEl = makeEl(nextIdx, nxtScale);
    nxtEl.style.transform = 'translateX(260px)';
    winEl.appendChild(curEl);
    winEl.appendChild(nxtEl);
  }

  function init() {
    const c = cur.current;
    buildWindow(winL.current, mod(c - 1, TOTAL), mod(c,     TOTAL), 1.0, 1.0);
    buildWindow(winC.current, mod(c,     TOTAL),  mod(c + 1, TOTAL), 1.5, 1.0);
    buildWindow(winR.current, mod(c + 1, TOTAL),  mod(c + 2, TOTAL), 1.0, 1.0);
  }

  function rotate() {
    if (busy.current) return;
    busy.current = true;

    const ease = `${DUR}ms cubic-bezier(0.4,0,0.2,1)`;

    function animateWindow(winEl, curScaleEnd, nxtScaleEnd) {
      const children = [...winEl.children];
      children.forEach(child => {
        const curTx = parseFloat(child.style.transform.replace('translateX(', '')) || 0;
        child.style.transition = `transform ${ease}`;
        child.style.transform = `translateX(${curTx - 260}px)`;
      });
      if (children[0]) {
        const inner = children[0].querySelector('div');
        inner.style.transition = `transform ${ease}`;
        inner.style.transform = `scale(${curScaleEnd})`;
      }
      if (children[1]) {
        const inner = children[1].querySelector('div');
        inner.style.transition = `transform ${ease}`;
        inner.style.transform = `scale(${nxtScaleEnd})`;
      }
    }

    animateWindow(winL.current, 1.0, 1.0);
    animateWindow(winC.current, 1.2, 1.5);
    animateWindow(winR.current, 1.5, 1.0);

    setTimeout(() => {
      cur.current = mod(cur.current + 1, TOTAL);
      const c = cur.current;

      function refreshWindow(winEl, nextIdx, nxtScale) {
        winEl.children[0].remove();
        const remaining = winEl.children[0];
        remaining.style.transition = 'none';
        const nxtEl = makeEl(nextIdx, nxtScale);
        nxtEl.style.cssText += 'transition:none;';
        nxtEl.style.transform = 'translateX(260px)';
        winEl.appendChild(nxtEl);
      }

      refreshWindow(winL.current, mod(c,     TOTAL), 1.0);
      refreshWindow(winC.current, mod(c + 1, TOTAL), 1.0);
      refreshWindow(winR.current, mod(c + 2, TOTAL), 1.0);

      busy.current = false;
    }, DUR + 80);
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
            authenticity, and community. Since 2016, we've been crafting coffee
            experiences inspired by global standards and elevated by local
            values—bringing culture and creativity into every cup.
          </p>
          <button className={styles.button}>Explore About Us</button>
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