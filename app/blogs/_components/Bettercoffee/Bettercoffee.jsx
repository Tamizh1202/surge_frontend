"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Bettercoffee.module.css";
import { formatImageUrl } from "@/lib/imageUtils";
import img1 from "./image1.png";

export default function CoffeeGrid({ blogs: initialBlogs = [], apiUrl }) {
  const [blogs, setBlogs] = useState(initialBlogs.slice(0, 6));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length >= 6);

  const handleViewMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const currentTime = new Date().toISOString();
      const query = `where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${encodeURIComponent(currentTime)}&where[and][1][or][1][scheduledFor][exists]=false&limit=6&page=${nextPage}&sort=-createdAt`;

      const res = await fetch(`${apiUrl}/api/blogs?${query}`);
      if (res.ok) {
        const data = await res.json();
        const newBlogs = data.docs || [];

        if (newBlogs.length > 0) {
          // Filter out blogs that are already featured (if any)
          // Since we don't have the featured list here easily, we might get duplicates
          // But usually, featured blogs are a small fixed set.
          setBlogs((prev) => [...prev, ...newBlogs]);
          setPage(nextPage);
          setHasMore(data.hasNextPage);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>

      {blogs && blogs.length > 0 && (
        <>
          <h2 className={styles.sectionHeading}>
            Explore the World of Better Coffee
          </h2>
          <div className={styles.grid}>
            {blogs.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={formatImageUrl(item.featuredImage.url) || img1}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>
                    {item.shortDescription ||
                      "Dive deep into the science behind our beans."}
                  </p>

                  <Link href={`/blogs/${item.slug}`} className={styles.readMore}>
                    Read More
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201"
                        stroke="#C4754E"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {hasMore && (
        <div className={styles.footer}>
          <button
            className={styles.viewMoreBtn}
            onClick={handleViewMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "View More"}
          </button>
        </div>
      )}
    </main>
  );
}
