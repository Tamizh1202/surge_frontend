'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Blogdetails.module.css';
import { formatImageUrl } from '@/lib/imageUtils';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ExploreBlogs({ moreBlogs }) {
  const listRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const showDots = moreBlogs.length >= 3;
  const maxIndex = moreBlogs.length - 1;

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / moreBlogs.length;
    const idx = Math.min(
      Math.round(el.scrollLeft / cardWidth),
      moreBlogs.length - 1
    );
    setActiveIdx(idx);
  };

  const scroll = (dir) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.rightCard}`);
    if (!card) return;
    const step = card.offsetWidth + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    setActiveIdx((prev) => Math.min(Math.max(prev + dir, 0), maxIndex));
  };

  return (
    <aside className={styles.rightColumn}>
      <div className={styles.exploreBlogsHeader}>
        <h3 className={styles.rightTitle}>Explore more blogs</h3>
        <div className={styles.sliderControls}>
          <button
            className={`${styles.arrowBtn} ${activeIdx === 0 ? '' : styles.activeBtn}`}
            onClick={() => scroll(-1)}
            disabled={activeIdx === 0}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M6.75 0.75L0.75 6.75L6.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`${styles.arrowBtn} ${activeIdx >= maxIndex ? '' : styles.activeBtn}`}
            onClick={() => scroll(1)}
            disabled={activeIdx >= maxIndex}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M0.75 0.75L6.75 6.75L0.75 12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.rightList} ref={listRef} onScroll={handleScroll}>
        {moreBlogs.map((item) => {
          const thumbUrl = formatImageUrl(item.featuredImage?.url);
          return (
            <Link href={`/blogs/${item.slug}`} key={item.id} className={styles.rightCard}>
              <div className={styles.rightThumb}>
                {thumbUrl && (
                  <Image src={thumbUrl} alt={item.title} width={209} height={128} style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div className={styles.sidebarInfo}>
                <span className={styles.readTime}>{item.readTime ? `${item.readTime} Minutes Read` : '5 Minutes Read'}</span>
                <p className={styles.sidebarBlogTitle}>{item.title}</p>
                <span className={styles.sidebarDate}>{formatDate(item.createdAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* {showDots && (
        <div className={styles.scrollDots}>
          {moreBlogs.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      )} */}
    </aside>
  );
}
