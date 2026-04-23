'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Listing.module.css';
import Image from 'next/image';
import Link from 'next/link';
import axiosClient from '@/lib/axios';
import { formatImageUrl } from '@/lib/imageUtils';
import coffeeImg from './coffee.png'; // fallback image

const SORT_OPTIONS = ['Recommended', 'Price:High to Low', 'Price:Low to High', 'Popularity'];

export default function Listing({ category }) {
    const [openSections, setOpenSections] = useState([]);
    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Recommended');
    const [wishlist, setWishlist] = useState([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    // --- NEW STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const mobileFiltersRef = useRef(null);
    const categoryName = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    // --- FETCH ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosClient.get(`/api/web-products/${page}`, {
                    params: {
                        'where[_status][equals]': 'published',
                        'where[category][equals]': category, // filter by category
                    }
                });

                const data = res.data;

                // Payload CMS returns { docs: [], totalDocs, totalPages, ... }
                setProducts(data.docs || []);
                setTotalProducts(data.totalDocs || 0);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, page]);

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleFilter = (id) => {
        setOpenSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleViewMore = () => {
        setPage(prev => prev + 1); // load next page
    };

    useEffect(() => {
        const method = isMobileFilterOpen ? 'add' : 'remove';
        document.documentElement.classList[method]('lock-scroll');
        return () => document.documentElement.classList.remove('lock-scroll');
    }, [isMobileFilterOpen]);

    const renderFilters = () => (
        <div className={styles.filterContainerBox}>
            {/* your existing filter render — untouched */}
        </div>
    );

    return (
        <div className={styles.mainContainer}>
            <aside className={styles.sidebar}>
                <h2 className={styles.filterTitle}>Filter</h2>
                {renderFilters()}
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.gridHeader}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.mainTitle}>{categoryName}</h1>
                        <p className={styles.itemCount}>({totalProducts} items)</p>
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.mobileFilterBtn} onClick={() => setIsMobileFilterOpen(true)}>
                            Filter
                        </button>

                        <div className={styles.sortWrapper}>
                            <div
                                className={`${styles.sortBox} ${showSort ? styles.activeSortBox : ''}`}
                                onClick={() => setShowSort(!showSort)}
                            >
                                <span className={styles.sortLabel}>Sort By : </span>
                                <span className={styles.sortValue}>{selectedSort}</span>
                            </div>
                            {showSort && (
                                <div className={styles.dropdownMenu}>
                                    {SORT_OPTIONS.map((option) => (
                                        <div
                                            key={option}
                                            className={`${styles.dropdownItem} ${selectedSort === option ? styles.activeItem : ''}`}
                                            onClick={() => { setSelectedSort(option); setShowSort(false); }}
                                        >
                                            <span className={styles.optionText}>{option}</span>
                                            <span className={styles.radioCircle}></span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* STATES */}
                {loading && <p className={styles.stateMsg}>Loading...</p>}
                {error && <p className={styles.stateMsg}>{error}</p>}
                {!loading && !error && (
                    <div className={styles.productGrid}>
                        {products.slice(0, visibleCount).map((item) => {
                            // Map Payload CMS fields to your card
                            const imageUrl = formatImageUrl(item.image) || coffeeImg;
                            const slug = item.slug || item.id;
                            const name = item.name || item.title || '';
                            const notes = item.notes || item.description || '';
                            const price = item.price ? `AED ${item.price}` : '';

                            return (
                                <Link href={`/shop/${category}/${slug}`} key={item.id} className={styles.linkWrapper}>
                                    <div className={styles.productCard}>
                                        <div className={styles.imageWrapper}>
                                            <button
                                                className={styles.wishlistIcon}
                                                onClick={(e) => { e.preventDefault(); toggleWishlist(item.id); }}
                                            >
                                                <svg width="20" height="18" viewBox="0 0 24 24"
                                                    fill={wishlist.includes(item.id) ? "#C6825B" : "white"}>
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            </button>
                                            <Image
                                                src={imageUrl}
                                                alt={name}
                                                width={295}
                                                height={339}
                                                className={styles.productImg}
                                            />
                                        </div>
                                        <div className={styles.details}>
                                            <h3 className={styles.name}>{name}</h3>
                                            <p className={styles.notes}>{notes}</p>
                                            <div className={styles.footerRow}>
                                                <span className={styles.priceTag}>{price}</span>
                                                <button className={styles.buyBtn}>Add to Cart</button>
                                                <span className={styles.mobileText}>Shop Now</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
                {!loading && visibleCount < totalProducts && (
                    <div className={styles.footer}>
                        <button className={styles.viewMoreBtn} onClick={handleViewMore}>
                            View More
                        </button>
                    </div>
                )}
            </main>
            {isMobileFilterOpen && (
                <>
                    <div className={styles.MobileFilterOverlay} onClick={() => setIsMobileFilterOpen(false)} />
                    <div className={styles.MobileFilters} ref={mobileFiltersRef}>
                        <div className={styles.MobileFilterHeader}>
                            <p>Filters</p>
                            <span onClick={() => setIsMobileFilterOpen(false)}>✕</span>
                        </div>
                        <div className={styles.LeftBottom}>
                            {renderFilters()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}   