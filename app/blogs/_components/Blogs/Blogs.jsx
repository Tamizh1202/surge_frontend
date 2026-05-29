"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import styles from "./Blogs.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import zeroBlog from "./NoBlogs.gif";

export default function Blogs({ initialBlogs = [] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs for GSAP targets
  const imgSlides = useRef([]);
  const txtSlides = useRef([]);
  const curRef = useRef(0);       // mutable, not tied to render cycle
  const busyRef = useRef(false);
  const autoTimer = useRef(null);

  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  // ─── Initialise slide positions once blogs are set ────────────────────────
  useEffect(() => {
    if (!blogs.length) return;

    imgSlides.current.forEach((el, i) => {
      if (el) gsap.set(el, { x: i === 0 ? "0%" : "100%" });
    });
    txtSlides.current.forEach((el, i) => {
      if (el) gsap.set(el, { x: i === 0 ? "0%" : "100%" });
    });

    curRef.current = 0;
    setCurrentIndex(0);

    resetAuto();

    return () => {
      clearInterval(autoTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs]);

  // ─── Core transition ───────────────────────────────────────────────────────
  const goTo = useCallback((toIdx, dir) => {
    const total = blogs.length;
    if (busyRef.current || toIdx === curRef.current || total < 2) return;
    busyRef.current = true;
    setCurrentIndex(toIdx);

    const fromImg = imgSlides.current[curRef.current];
    const fromTxt = txtSlides.current[curRef.current];
    const toImg = imgSlides.current[toIdx];
    const toTxt = txtSlides.current[toIdx];

    gsap.set([toImg, toTxt], { x: `${dir * 100}%` });

    gsap.timeline({
      onComplete() {
        curRef.current = toIdx;
        busyRef.current = false;
        // setCurrentIndex(toIdx);
      },
    })
      .to([fromImg, fromTxt], { x: `${dir * -100}%`, duration: 0.72, ease: "power3.inOut" }, 0)
      .to([toImg, toTxt], { x: "0%", duration: 0.72, ease: "power3.inOut" }, 0);
  }, [blogs]);

  const nextSlide = useCallback(() => {
    const next = (curRef.current + 1) % blogs.length;
    goTo(next, 1);
  }, [blogs, goTo]);

  const resetAuto = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      nextSlide();
    }, 4000);
  }, [nextSlide]);

  // ─── Dot / nav handlers ────────────────────────────────────────────────────
  const handleDotClick = useCallback((i) => {
    const dir = i >= curRef.current ? 1 : -1;
    goTo(i, dir);
    resetAuto();
  }, [goTo, resetAuto]);

  // ─── Touch / swipe ─────────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const total = blogs.length;
      const dir = diff > 0 ? 1 : -1;
      const next = ((curRef.current + dir) + total) % total;
      goTo(next, dir);
      resetAuto();
    }
  };

  // ─── Zero state ───────────────────────────────────────────────────────────
  if (!blogs.length) {
    return (
      <div className={styles.main}>
        <div className={styles.latestBlogs}>
          <h4 className={styles.latestBlogsHeading}>LATEST BLOGS</h4>
          <div className={styles.latestBlogsZeroState}>
            <div>
              <Image src={zeroBlog} alt="No blogs" width={180} height={180} priority />
              <p className={styles.latestBlogsZeroTitle}>Brewing stories soon</p>
              <p className={styles.latestBlogsZeroSubtitle}>
                Our latest coffee guides and stories will appear here.
              </p>
              <Link href="/shop/coffee-beans" className={styles.latestBlogsZeroButton}>
                Shop Coffee
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Carousel ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.main}>
      <div
        className={styles.mainCard}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── LEFT: image sliding window ───────────────────────────── */}
        <div className={styles.imgWindow}>
          {blogs.map((blog, i) => (
            <div
              key={blog.id}
              className={styles.imgSlide}
              ref={(el) => (imgSlides.current[i] = el)}
            >
              <Image
                src={formatImageUrl(blog.featuredImage?.url)}
                alt={blog.title}
                fill
                priority={i === 0}
                className={styles.image}
              />
            </div>
          ))}
        </div>

        {/* ── RIGHT: static card ───────────────────────────────────── */}
        <div className={styles.rightSide}>

          {/* Text sliding window — only top portion animates */}
          <div className={styles.textWindow}>
            {blogs.map((blog, i) => (
              <div
                key={blog.id}
                className={styles.textSlide}
                ref={(el) => (txtSlides.current[i] = el)}
              >
                {/* Read time */}
                <div className={styles.timeWrapper}>
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path
                      d="M10.0317 19.3129C15.1578 19.3129 19.3133 15.1575 19.3133 10.0315C19.3133 4.90545 15.1578 0.75 10.0317 0.75C4.90554 0.75 0.75 4.90545 0.75 10.0315C0.75 15.1575 4.90554 19.3129 10.0317 19.3129Z"
                      stroke="#818686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M9 5.90625V11.0626H14.1565"
                      stroke="#818686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  <h3 className={styles.min}>{blog.readTime} min</h3>
                </div>

                {/* Heading + description */}
                <div className={styles.textGroup}>
                  <h1 className={styles.head}>{blog.title}</h1>
                  <p className={styles.description}>
                    {blog.shortDescription || "Dive deep into the science behind our beans."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM: completely static — never touched by GSAP ──── */}
          <div className={styles.bottom}>
            <Link href={`/blogs/${blogs[currentIndex]?.slug}`} className={styles.read}>
              Read More
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201"
                  stroke="#C4754E"
                />
              </svg>
            </Link>

            <div className={styles.btn}>
              {blogs.map((_, i) => (
                <span
                  key={i}
                  className={styles.dot}
                  onClick={() => handleDotClick(i)}
                  style={{
                    width: i === currentIndex ? 13 : 9,
                    height: i === currentIndex ? 13 : 9,
                    background: i === currentIndex ? "#c4754e" : "#ccc",
                    display: "inline-block",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}