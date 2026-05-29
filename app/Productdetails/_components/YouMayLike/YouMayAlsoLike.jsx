'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './YouMayAlsoLike.module.css';
import { formatImageUrl } from '@/lib/imageUtils';
import { useCart } from '@/app/_context/CartContext';
import { useWishlist } from '@/app/_context/WishlistContext';
import ProductPopup from '@/app/shop/[category]/_components/AddToCartPopup/AddToCartPopup';

const toSlug = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const getDisplayPrice = (product) => {
    const firstVariant = product.variants?.[0];
    const rawPrice = firstVariant
        ? (firstVariant.variantSalePrice || firstVariant.variantRegularPrice)
        : (product.salePrice || product.regularPrice);

    if (!rawPrice) return '';

    const numericPrice = Number(rawPrice);
    return Number.isFinite(numericPrice)
        ? `AED ${Math.round(numericPrice)}`
        : `AED ${rawPrice}`;
};

export default function YouMayAlsoLike({ recommendedProducts }) {
    const { addToCart } = useCart();
    const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();

    const isInWishlist = (id) =>
        wishlistItems.some((it) => {
            const itemProductId = it.product?.value?.id || it.product?.id || it.product;
            return String(itemProductId) === String(id);
        });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popupProduct, setPopupProduct] = useState(null);
    const [addingId, setAddingId] = useState(null);

    // ── Dot indicator state (mobile carousel only) ──
    const [activeDot, setActiveDot] = useState(0);
    const gridRef = useRef(null);

    useEffect(() => {
        if (recommendedProducts && recommendedProducts.length > 0) {
            const mapped = recommendedProducts.map((p) => {
                const productSlug = p.slug || p.value?.slug || p.product?.slug || toSlug(p.name || p.title);
                return {
                    id: p.id,
                    title: p.name,
                    subtitle: p.tagline,
                    image: formatImageUrl(p.productImage),
                    price: getDisplayPrice(p),
                    slug: productSlug,
                    categorySlug: p.categories?.slug || p.categories?.[0]?.slug || 'coffee-beans',
                    isOutOfStock: p.variants?.length > 0
                        ? p.variants.every(v => v.variantInStock === false)
                        : p.inStock === false,
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

    // Update active dot as user scrolls the carousel
    const handleScroll = useCallback(() => {
        const el = gridRef.current;
        if (!el) return;
        const cardWidth = el.scrollWidth / products.length;
        const idx = Math.round(el.scrollLeft / cardWidth);
        setActiveDot(Math.min(idx, products.length - 1));
    }, [products.length]);

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
                <div className={styles.grid} ref={gridRef} onScroll={handleScroll}>
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
                                    <button
                                        className={styles.wishlistBtn}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24"
                                            fill={isInWishlist(product.id) ? '#EA2424' : 'white'}>
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </Link>
                                <div className={styles.info}>
                                    <Link href={productHref} className={styles.titleLink}>
                                        <h3 className={styles.title}>{product.title}</h3>
                                    </Link>
                                    <p className={styles.subtitle}>{product.subtitle}</p>
                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>{product.price}</span>
                                        {product.isOutOfStock ? (
                                            <button className={`${styles.addToCart} ${styles.outOfStock}`} disabled>
                                                Out of Stock
                                            </button>
                                        ) : (
                                            <button
                                                className={styles.addToCart}
                                                onClick={() => handleAddToCart(product)}
                                                disabled={isAdding}
                                                style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
                                            >
                                                {isAdding ? 'Adding...' : 'Add to Cart'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dot indicators — only visible on mobile via CSS */}
                {products.length > 1 && (
                    <div className={styles.dots}>
                        {products.map((_, i) => (
                            <span
                                key={i}
                                className={`${styles.dot} ${i === activeDot ? styles.dotActive : ''}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {popupProduct && (
                <ProductPopup product={popupProduct} onClose={() => setPopupProduct(null)} />
            )}
        </>
    );
}