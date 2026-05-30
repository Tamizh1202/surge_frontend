'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Listing.module.css';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from '@/components/AddToCart';
import axiosClient from '@/lib/axios';
import { formatImageUrl } from '@/lib/imageUtils';
import coffeeImg from './coffee.png';
import { useWishlist } from '@/app/_context/WishlistContext';
import PageLoader from '@/components/PageLoader/PageLoader';

import prodZero from './prodZero.png';
import ProductPopup from '../AddToCartPopup/AddToCartPopup';
import prod from './Noproducts.gif';

const SORT_OPTIONS = ['Recommended', 'Price:High to Low', 'Price:Low to High', 'Popularity'];

export default function Listing({ category }) {
    const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();
    const [openSections, setOpenSections] = useState(null);
    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Recommended');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isFilterClosing, setIsFilterClosing] = useState(false);
    const filterCloseTimer = useRef(null);
    const [popupProduct, setPopupProduct] = useState(null);

    const closeFilter = () => {
        setIsFilterClosing(true);
        filterCloseTimer.current = setTimeout(() => {
            setIsMobileFilterOpen(false);
            setIsFilterClosing(false);
        }, 280);
    };

    // Refs for outside click detection
    const sortRef = useRef(null);
    const mobileFiltersRef = useRef(null);

    const isInWishlist = (id) => {
        return wishlistItems.some(it => {
            const itemProductId = it.product?.value?.id || it.product?.id || it.product;
            return String(itemProductId) === String(id);
        });
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [filterData, setFilterData] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const categoryName = category?.title || category?.slug?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    // Effect to handle clicking outside the Sort Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSort(false);
            }
        };

        if (showSort) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSort]);

    const handleClearFilters = () => {
        setSelectedFilters([]);
        closeFilter();
    };

    useEffect(() => {
        const fetchFilters = async () => {
            if (!category?.id) return;
            try {
                const res = await axiosClient.get(`/api/web-sub-categories`, {
                    params: {
                        'where[parentCategory][equals]': category.id,
                        depth: 1
                    }
                });
                const docs = res.data.docs || [];
                const allGroups = docs.reduce((acc, doc) => {
                    return [...acc, ...(doc.level1 || [])];
                }, []);
                setFilterData(allGroups);
            } catch (err) {
                console.error("Error fetching filters:", err);
            }
        };
        fetchFilters();
    }, [category?.id]);

    useEffect(() => {
        setPage(1);
        setProducts([]);
    }, [category?.id, selectedSort]);

    useEffect(() => {
        async function fetchData() {
            if (!category?.id) return;
            setLoading(true);
            try {
                const sortParam = '-createdAt';

                const res = await axiosClient.get(
                    `/api/web-products`,
                    {
                        params: {
                            'where[categories][equals]': category.id,
                            'where[_status][equals]': 'published',
                            limit: 9,
                            page: page,
                            sort: sortParam,
                            depth: 1
                        }
                    }
                );
                const allProducts = res.data.docs || [];
                setProducts(prev => page === 1 ? allProducts : [...prev, ...allProducts]);
                setTotalProducts(res.data.totalDocs || 0);
                setHasNextPage(res.data.hasNextPage);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [category?.id, page, selectedSort]);

    const filteredProducts = products.filter((product) => {
        if (selectedFilters.length === 0) return true;
        return product.subCategories?.some((sub) =>
            selectedFilters.includes(sub.level2Id)
        );
    });

    const getDisplayPrice = (item) => {
        const firstVariant = item.variants?.[0];
        return parseFloat(
            firstVariant
                ? (firstVariant.variantSalePrice || firstVariant.variantRegularPrice || 0)
                : (item.salePrice || item.regularPrice || 0)
        );
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedSort === 'Price:Low to High') return getDisplayPrice(a) - getDisplayPrice(b);
        if (selectedSort === 'Price:High to Low') return getDisplayPrice(b) - getDisplayPrice(a);
        return 0;
    });

    const toggleFilter = (id) => {
        setOpenSections(prevId => prevId === id ? null : id);
    };

    const handleViewMore = () => {
        setPage(prev => prev + 1);
    };

    const handleFilterChange = (level2Id) => {
        setSelectedFilters(prev => {
            return prev.includes(level2Id)
                ? prev.filter(id => id !== level2Id)
                : [...prev, level2Id];
        });
    };

    useEffect(() => {
        const method = isMobileFilterOpen ? 'add' : 'remove';
        document.documentElement.classList[method]('lock-scroll');
        return () => document.documentElement.classList.remove('lock-scroll');
    }, [isMobileFilterOpen]);

    const renderFilters = () => (
        <div className={styles.filterContainerBox}>
            {filterData.map((group) => {
                const isOpen = openSections === group.id;
                return (
                    <div key={group.id} className={styles.filterSection}>
                        <button
                            className={styles.filterHeader}
                            onClick={() => toggleFilter(group.id)}
                        >
                            <span>{group.name}</span>
                            <svg
                                width="12"
                                height="8"
                                viewBox="0 0 12 8"
                                fill="none"
                                className={`${styles.sortArrow} ${isOpen ? styles.arrowRotate : ''}`}
                            >
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#414343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className={`${styles.optionsWrapper} ${isOpen ? styles.isOpen : ''}`}>
                            <div className={styles.optionsList}>
                                {group.level2?.map((option) => (
                                    <label key={option.id} className={styles.optionLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxCustom}
                                            checked={selectedFilters.includes(option.id)}
                                            onChange={() => handleFilterChange(option.id)}
                                        />
                                        {option.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className={styles.mainContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.filterTitle}>Filter</h2>
                    {selectedFilters.length > 0 && (
                        <button className={styles.clearBtn} onClick={handleClearFilters}>Clear All</button>
                    )}
                </div>
                {renderFilters()}
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.gridHeader}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.mainTitle}>{categoryName}</h1>
                        <p className={styles.itemCount}>({filteredProducts.length} items)</p>
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.mobileFilterBtn} onClick={() => setIsMobileFilterOpen(true)}>
                            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.30044 10.3419C5.30038 10.4494 5.33141 10.5549 5.39002 10.6464C5.44864 10.738 5.53253 10.8119 5.63228 10.86L6.83245 11.4389C6.92396 11.4831 7.02564 11.5039 7.12783 11.4994C7.23003 11.4949 7.32934 11.4653 7.41634 11.4134C7.50334 11.3615 7.57515 11.289 7.62493 11.2028C7.67471 11.1166 7.70081 11.0195 7.70076 10.9208V6.86826C7.7009 6.58134 7.81146 6.30467 8.01101 6.09192L12.3454 1.46682C12.4231 1.38378 12.4742 1.2808 12.4925 1.17034C12.5108 1.05988 12.4955 0.946665 12.4486 0.844393C12.4016 0.74212 12.3249 0.655167 12.2278 0.594049C12.1307 0.53293 12.0173 0.500264 11.9013 0.5H1.09987C0.983814 0.50004 0.870264 0.532545 0.772971 0.593577C0.675677 0.654608 0.598815 0.741548 0.551693 0.843865C0.504572 0.946182 0.489214 1.05949 0.507479 1.17005C0.525745 1.28062 0.57685 1.3837 0.654605 1.46682L4.99019 6.09192C5.18974 6.30467 5.3003 6.58134 5.30044 6.86826V10.3419Z" stroke="#414343" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            Filter {selectedFilters.length > 0 && `(${selectedFilters.length})`}
                        </button>
                        {/* Added ref={sortRef} to the wrapper */}
                        <div className={styles.sortWrapper} ref={sortRef}>
                            <div
                                className={`${styles.sortBox} ${showSort ? styles.activeSortBox : ''}`}
                                onClick={() => setShowSort(!showSort)}
                            >
                                <span className={styles.sortLabel}>Sort By : </span>
                                <span className={styles.sortValue}>{selectedSort}</span>
                                <svg
                                    className={`${styles.sortArrow} ${showSort ? styles.rotateArrow : ''}`}
                                    width="16" height="10" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M6.63055 6.75943C6.23768 7.16467 5.58748 7.16467 5.1946 6.75943L0.285735 1.69607C-0.329211 1.06177 0.120255 1.54337e-07 1.00371 8.53452e-08L10.8214 -6.81352e-07C11.7049 -7.50344e-07 12.1544 1.06177 11.5394 1.69607L6.63055 6.75943Z" fill="#C4754E" />
                                </svg>
                            </div>

                            <div className={`${styles.dropdownMenu} ${showSort ? styles.showDropdown : ''}`}>
                                <div className={styles.dropdownInner}>
                                    {SORT_OPTIONS.map((option) => (
                                        <div
                                            key={option}
                                            className={`${styles.dropdownItem} ${selectedSort === option ? styles.activeItem : ''}`}
                                            onClick={() => {
                                                setSelectedSort(option);
                                                setShowSort(false);
                                            }}
                                        >
                                            <span className={styles.optionText}>{option}</span>
                                            <span className={styles.radioCircle}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {loading && products.length === 0 && <PageLoader />}

                {error && (
                    <div className={styles.stateMsgContainer}><p className={styles.errorMsg}>{error}</p></div>
                )}

                <div className={styles.productGrid}>
                    {!loading && sortedProducts.length === 0 ? (
                        <div className={styles.noProducts}>
                            <div className={styles.noProductsIcon}>
                                <Image src={prod} alt="No products" width={200} height={200} priority />
                            </div>
                            <h3>Nothing Brewing here</h3>
                            <p>Refine or clear filters to explore available selections.</p>
                            <Link href="/shop" className={styles.resetBtn}>
                                Explore All Products
                            </Link>
                        </div>
                    ) : (
                        sortedProducts.map((item) => {
                            const imageUrl = formatImageUrl(item.productImage) || coffeeImg;
                            const slug = item.slug || item.id;
                            const name = item.name || '';
                            const notes = item.tagline || item.description || '';
                            const firstVariant = item.variants?.[0];
                            const rawPrice = firstVariant
                                ? (firstVariant.variantSalePrice || firstVariant.variantRegularPrice)
                                : (item.salePrice || item.regularPrice);
                            const price = rawPrice ? `AED ${rawPrice}` : '';
                            const isOutOfStock = item.variants?.length > 0
                                ? item.variants.every(v => v.variantInStock === false)
                                : item.inStock === false;

                            return (
                                <Link href={`/shop/${category?.slug || 'all'}/${slug}`} key={item.id} className={styles.linkWrapper}>
                                    <div className={styles.productCard}>
                                        <div className={styles.imageWrapper}>
                                            <div className={styles.badgeStack}>
                                                {item.isLatest && (
                                                    <span className={`${styles.badge} ${styles.badgeNew}`}>
                                                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.87806 3.33295L5.14235 0.552131C5.0356 0.149429 4.4644 0.14922 4.35765 0.551922L3.62194 3.33295C3.60363 3.4023 3.56727 3.46556 3.51657 3.5163C3.46587 3.56703 3.40264 3.60343 3.3333 3.6218L0.55203 4.3575C0.149323 4.46425 0.149323 5.03565 0.55203 5.14239L3.33289 5.8781C3.40223 5.89641 3.46549 5.93277 3.51623 5.98347C3.56696 6.03417 3.60337 6.0974 3.62173 6.16673L4.35744 8.94797C4.46419 9.35068 5.0356 9.35068 5.14235 8.94797L5.87806 6.16694C5.89637 6.09759 5.93273 6.03434 5.98343 5.9836C6.03413 5.93287 6.09736 5.89646 6.1667 5.8781L8.94797 5.14219C9.35068 5.03544 9.35068 4.46404 8.94797 4.35729L6.16691 3.62159C6.09756 3.60327 6.0343 3.56692 5.98356 3.51622C5.93283 3.46552 5.89642 3.40229 5.87806 3.33295Z" fill="#C4754E" stroke="#C4754E" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                        New arrival
                                                    </span>
                                                )}
                                                {item.isBestseller && (
                                                    <span className={`${styles.badge} ${styles.badgeBestseller}`}>
                                                        <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7.91 2.2651L6.2825 6.14939L2.12625 6.51216L5.285 9.29044L4.34 13.3871L7.91 11.2193V12.2457L3.0275 15.2186L4.305 9.60012L0 5.81316L5.67875 5.30882L7.91 0V2.2651Z" fill="white" />
                                                        </svg>
                                                        Bestseller
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className={`${styles.wishlistIcon} ${isInWishlist(item.id) ? styles.wishlistIconActive : ''}`}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item.id); }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24"
                                                    fill={isInWishlist(item.id) ? "#EA2424" : "white"}>
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
                                        <div className={`${styles.details} ${!notes ? styles.detailsSpaced : ''}`}>
                                            <h3 className={styles.name}>{name}</h3>
                                            {notes && <p className={styles.notes}>{notes}</p>}
                                            <div className={styles.footerRow}>
                                                <span className={styles.priceTag}>{price}.00</span>
                                                {isOutOfStock ? (
                                                    <>
                                                        <button className={`${styles.buyBtn} ${styles.outOfStockBtn}`} disabled>Out of Stock</button>
                                                        <button className={`${styles.mobileText} ${styles.outOfStockBtn}`} disabled>Out of Stock</button>
                                                    </>
                                                ) : (item.variants?.length > 0 && (item.productHighlights?.length > 0 || item.subCategories?.length > 0)) ? (
                                                    <>
                                                        <button
                                                            className={styles.buyBtn}
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPopupProduct(item); }}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                        <button
                                                            className={styles.mobileText}
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPopupProduct(item); }}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AddToCart
                                                            className={styles.buyBtn}
                                                            product={{
                                                                productId: item.id,
                                                                name: item.name,
                                                                description: item.description,
                                                                image: imageUrl,
                                                                tagline: item.tagline,
                                                                quantity: 1,
                                                                variationId: item.variants?.[0]?.id || null
                                                            }}
                                                        />
                                                        <AddToCart
                                                            className={styles.mobileText}
                                                            product={{
                                                                productId: item.id,
                                                                name: item.name,
                                                                description: item.description,
                                                                image: imageUrl,
                                                                tagline: item.tagline,
                                                                quantity: 1,
                                                                variationId: item.variants?.[0]?.id || null
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                {!loading && hasNextPage && filteredProducts.length > 0 && (
                    <div className={styles.footer}>
                        <button className={styles.viewMoreBtn} onClick={handleViewMore} disabled={loading}>
                            {loading ? "Loading..." : "View More"}
                        </button>
                    </div>
                )}
            </main>

            {/* Popups and Mobile Overlays handle click-to-close via the onClick on the overlay div */}
            {popupProduct && (
                <>
                    <div className={styles.popupOverlay} onClick={() => setPopupProduct(null)} />
                    <div className={styles.popupWrapper}>
                        <ProductPopup product={popupProduct} onClose={() => setPopupProduct(null)} />
                    </div>
                </>
            )}

            {isMobileFilterOpen && (
                <>
                    <div className={styles.MobileFilterOverlay} onClick={closeFilter} />
                    <div className={`${styles.MobileFilters} ${isFilterClosing ? styles.MobileFiltersClosing : ''}`} ref={mobileFiltersRef}>
                        <div className={styles.MobileFilterHeader}>
                            <p>Filters</p>
                            <span onClick={closeFilter}>✕</span>
                        </div>
                        <div className={styles.LeftBottom}>
                            {renderFilters()}
                        </div>
                        <div className={styles.MobileFilterFooter}>
                            <button onClick={handleClearFilters} className={styles.mobileResetBtn}>Reset</button>
                            <button onClick={closeFilter} className={styles.mobileApplyBtn}>Apply</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
