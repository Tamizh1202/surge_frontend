'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './YouMayAlsoLike.module.css';
import { formatImageUrl } from '@/lib/imageUtils';
import { useCart } from '@/app/_context/CartContext';
import ProductPopup from '@/app/shop/[category]/_components/AddToCartPopup/AddToCartPopup';

export default function YouMayAlsoLike({ recommendedProducts }) {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popupProduct, setPopupProduct] = useState(null);
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        if (recommendedProducts && recommendedProducts.length > 0) {
            const mapped = recommendedProducts.map((p) => {
                const price =
                    p.salePrice ||
                    p.regularPrice ||
                    p.variants?.[0]?.variantSalePrice ||
                    p.variants?.[0]?.variantRegularPrice ||
                    null;
                return {
                    id: p.id,
                    title: p.name,
                    subtitle: p.tagline,
                    image: formatImageUrl(p.productImage),
                    price: price ? `AED ${price}` : '',
                    slug: p.slug,
                    raw: p,
                };
            });
            setProducts(mapped);
            setLoading(false);
        } else if (recommendedProducts) {
            setProducts([]);
            setLoading(false);
        }
    }, [recommendedProducts]);

    const needsPopup = (raw) =>
        raw.variants?.length > 0 &&
        (raw.productHighlights?.length > 0 || raw.subCategories?.length > 0);

    const handleAddToCart = async (product) => {
        const raw = product.raw;
        if (needsPopup(raw)) {
            setPopupProduct(raw);
            return;
        }
        if (addingId) return;
        setAddingId(product.id);
        try {
            await addToCart(raw.id, 1, raw.variants?.[0]?.id || null, {
                name: raw.name,
                image: product.image,
            });
        } catch (err) {
            console.error('Add to cart error', err);
        } finally {
            setAddingId(null);
        }
    };

    if (error) {
        return (
            <section className={styles.section}>
                <h2 className={styles.heading}>You may also like</h2>
                <p className={styles.error}>Could not load products. Please try again later.</p>
            </section>
        );
    }

    return (
        <>
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
                        : products.map((product) => {
                              const isAdding = addingId === product.id;
                              return (
                                  <div key={product.id} className={styles.card}>
                                      <div className={styles.imageWrapper}>
                                          <Image
                                              src={product.image}
                                              alt={product.title}
                                              fill
                                              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
                                              className={styles.productImage}
                                          />
                                      </div>
                                      <div className={styles.info}>
                                          <h3 className={styles.title}>{product.title}</h3>
                                          <p className={styles.subtitle}>{product.subtitle}</p>
                                          <div className={styles.priceRow}>
                                              <span className={styles.price}>{product.price}</span>
                                              <button
                                                  className={styles.addToCart}
                                                  onClick={() => handleAddToCart(product)}
                                                  disabled={isAdding}
                                                  style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
                                              >
                                                  {isAdding ? 'Adding...' : 'Add to Cart'}
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                </div>
            </section>

            {popupProduct && (
                <ProductPopup product={popupProduct} onClose={() => setPopupProduct(null)} />
            )}
        </>
    );
}
