'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './YouMayAlsoLike.module.css';
import { formatImageUrl } from '@/lib/imageUtils';
import { useCart } from '@/app/_context/CartContext';
import ProductPopup from '@/app/shop/[category]/_components/AddToCartPopup/AddToCartPopup';

const toSlug = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

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
                const productSlug = p.slug || p.value?.slug || p.product?.slug || toSlug(p.name || p.title);
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
                    slug: productSlug,
                    categorySlug: p.categories?.slug || p.categories?.[0]?.slug || 'coffee-beans',
                    raw: p,
                };
            });
            setProducts(mapped);
            setLoading(false);
        } else {
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

    if (loading) return null;
    if (error || products.length === 0) return null;

    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.heading}>You may also like</h2>
                <div className={styles.grid}>
                    {products.map((product) => {
                              const isAdding = addingId === product.id;
                              const productHref = `/shop/${product.categorySlug}/${product.slug}`;
                              return (
                                  <div key={product.id} className={styles.card}>
                                      <Link
                                          href={productHref}
                                          className={styles.imageLink}
                                          aria-label={`View ${product.title}`}
                                      >
                                          <Image
                                              src={product.image}
                                              alt={product.title}
                                              fill
                                              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
                                              className={styles.productImage}
                                          />
                                      </Link>
                                      <div className={styles.info}>
                                          <Link href={productHref} className={styles.titleLink}>
                                              <h3 className={styles.title}>{product.title}</h3>
                                          </Link>
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
