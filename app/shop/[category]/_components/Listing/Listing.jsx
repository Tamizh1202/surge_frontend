'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Listing.module.css';
import Image from 'next/image';
import coffeeImg from './coffee.png';
import Link from 'next/link';
import { getFiltersByCategory } from "../../../../data/filters";
import { getProductsByCategory } from "../../../../data/products";

const SORT_OPTIONS = ['Recommended', 'Price:High to Low', 'Price:Low to High', 'Popularity'];
export default function Listing({ category }) {

    console.log(category)
    const [openSections, setOpenSections] = useState([]);
    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Recommended');
    const [wishlist, setWishlist] = useState([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const PRODUCTS = getProductsByCategory(category);
    const FILTER_DATA = getFiltersByCategory(category);
    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleFilter = (id) => {
        setOpenSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const categoryName = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const handleViewMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const mobileFiltersRef = useRef(null);

    useEffect(() => {
        const method = isMobileFilterOpen ? 'add' : 'remove';
        document.documentElement.classList[method]('lock-scroll');
        return () => document.documentElement.classList.remove('lock-scroll');
    }, [isMobileFilterOpen]);

    const renderFilters = () => (
        <div className={styles.filterContainerBox}>
            {FILTER_DATA.map((section) => {
                const isOpen = openSections.includes(section.id);
                return (section.options && (
                    <div key={section.id} className={styles.filterSection}>
                        <button className={styles.filterHeader} onClick={() => toggleFilter(section.id)}>
                            <span>{section.title}</span>
                            <span className={styles.icon}>
                                <svg
                                    className={isOpen ? styles.arrowRotate : ''}
                                    width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11.91 -0.00113773L12.97 1.05986L7.193 6.83886C7.10043 6.93202 6.99036 7.00595 6.86911 7.05639C6.74786 7.10684 6.61783 7.13281 6.4865 7.13281C6.35517 7.13281 6.22514 7.10684 6.10389 7.05639C5.98264 7.00595 5.87257 6.93202 5.78 6.83886L0 1.05986L1.06 -0.000137806L6.485 5.42386L11.91 -0.00113773Z"
                                        fill="#414343"
                                    />
                                </svg>
                            </span>
                        </button>
                        {isOpen && (
                            <div className={styles.optionsList}>
                                {section.options.map((opt) => (
                                    <label key={opt} className={styles.optionLabel}>
                                        <input type="checkbox" className={styles.checkboxCustom} />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ));
            })}
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
                        <p className={styles.itemCount}>({PRODUCTS.length} items)</p>
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.mobileFilterBtn} onClick={() => setIsMobileFilterOpen(true)}>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.66667 8V6.66667H7.33333V8H4.66667ZM2 4.66667V3.33333H10V4.66667H2ZM0 1.33333V0H12V1.33333H0Z" fill="#6E736A" />
                            </svg>
                            Filter
                        </button>

                        <div className={styles.sortWrapper}>
                            <div className={`${styles.sortBox} ${showSort ? styles.activeSortBox : ''}`} onClick={() => setShowSort(!showSort)}>
                                <span className={styles.sortLabel}>Sort By : </span>
                                <span className={styles.sortValue}>{selectedSort}</span>
                                <svg className={`${styles.sortArrow} ${showSort ? styles.arrowRotate : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.63055 6.75943C6.23768 7.16467 5.58748 7.16467 5.1946 6.75943L0.285735 1.69607C-0.329211 1.06177 0.120255 1.54337e-07 1.00371 8.53452e-08L10.8214 -6.81352e-07C11.7049 -7.50344e-07 12.1544 1.06177 11.5394 1.69607L6.63055 6.75943Z" fill="#C4754E" />
                                </svg>
                            </div>

                            {showSort && (
                                <div className={styles.dropdownMenu}>
                                    {SORT_OPTIONS.map((option) => (
                                        <div key={option} className={`${styles.dropdownItem} ${selectedSort === option ? styles.activeItem : ''}`} onClick={() => { setSelectedSort(option); setShowSort(false); }}>
                                            <span className={styles.optionText}>{option}</span>
                                            <span className={styles.radioCircle}></span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className={styles.productGrid}>
                    {PRODUCTS.slice(0, visibleCount).map((item) => (
                        <Link href={`/shop/${category}/${item.slug}`} key={item.id} className={styles.linkWrapper}>
                            <div className={styles.productCard}>
                                <div className={styles.imageWrapper}>

                                    <button className={styles.wishlistIcon} onClick={(e) => { e.preventDefault(); toggleWishlist(item.id); }}>
                                        <svg width="20" height="18" viewBox="0 0 24 24" fill={wishlist.includes(item.id) ? "#C6825B" : "white"}>
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                    <Image src={coffeeImg} alt={item.name} width={295} height={339} className={styles.productImg} />
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.name}>{item.name}</h3>
                                    <p className={styles.notes}>{item.notes}</p>
                                    <div className={styles.footerRow}>
                                        <span className={styles.priceTag}>{item.price}</span>
                                        <button className={styles.buyBtn}>Add to Cart</button>
                                        <span className={styles.mobileText}>Shop Now</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {visibleCount < PRODUCTS.length && (
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