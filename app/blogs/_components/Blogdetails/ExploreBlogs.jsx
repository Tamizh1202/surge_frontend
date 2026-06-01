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

  return (
    <aside className={styles.rightColumn}>
      <h3 className={styles.rightTitle}>Explore more blogs</h3>
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
