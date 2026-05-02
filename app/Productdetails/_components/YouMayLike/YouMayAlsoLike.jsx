'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './YouMayAlsoLike.module.css';
import { formatImageUrl } from '@/lib/imageUtils';

export default function YouMayAlsoLike({ recommendedProducts }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlisted, setWishlisted] = useState({});

    useEffect(() => {
        if (recommendedProducts && recommendedProducts.length > 0) {
            const mapped = recommendedProducts.map((p) => ({
                id: p.id,
                title: p.name,
                subtitle: p.tagline,
                image: formatImageUrl(p.productImage),
                price: p.salePrice || p.regularPrice,
                currency: 'AED',
                slug: p.slug,
            }));
            setProducts(mapped);
            setLoading(false);
        } else if (recommendedProducts) {
            setProducts([]);
            setLoading(false);
        }
    }, [recommendedProducts]);

    const toggleWishlist = (id) =>
        setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));

    if (error) {
        return (
            <section className={styles.section}>
                <h2 className={styles.heading}>You may also like</h2>
                <p className={styles.error}>Could not load products. Please try again later.</p>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>You may also like</h2>
            <div className={styles.grid}>
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                              <div className={styles.skeletonImage} />
                              <div className={styles.info}>
                                  <div className={styles.skeletonLine} />
                                  <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                                  <div className={styles.skeletonLine} />
                              </div>
                          </div>
                      ))
                    : products.map((product) => (
                          <div key={product.id} className={styles.card}>
                              <div className={styles.imageWrapper}>
                                  <Image
                                      src={product.image}
                                      alt={product.title}
                                      fill
                                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
                                      className={styles.productImage}
                                  />
                                  {/* <button
                                      className={`${styles.wishlistBtn} ${wishlisted[product.id] ? styles.wishlisted : ''}`}
                                      aria-label="Add to wishlist"
                                      onClick={() => toggleWishlist(product.id)}
                                  >
                                      <svg
                                          width="20"
                                          height="18"
                                          viewBox="0 0 20 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <path
                                              d="M10 17.77L8.55 16.45C3.4 11.73 0 8.64 0 4.89C0 1.8 2.42 -0.01 5.5 -0.01C7.24 -0.01 8.91 0.81 10 2.09C11.09 0.81 12.76 -0.01 14.5 -0.01C17.58 -0.01 20 1.8 20 4.89C20 8.64 16.6 11.73 11.45 16.45L10 17.77Z"
                                              fill="none"
                                              stroke={wishlisted[product.id] ? 'var(--primary-color)' : '#555'}
                                              strokeWidth="1.2"
                                          />
                                      </svg>
                                  </button> */}
                              </div>
                              <div className={styles.info}>
                                  <h3 className={styles.title}>{product.title}</h3>
                                  <p className={styles.subtitle}>{product.subtitle}</p>
                                  <div className={styles.priceRow}>
                                      <span className={styles.price}>
                                          {product.currency} {product.price}
                                      </span>
                                      <button className={styles.addToCart}>Add to Cart</button>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>
        </section>
    );
}