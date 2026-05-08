'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Listing.module.css';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from '@/components/AddToCart';
import axiosClient from '@/lib/axios';
import { formatImageUrl } from '@/lib/imageUtils';
import coffeeImg from './coffee.png'; // fallback image
import { useWishlist } from '@/app/_context/WishlistContext';

const SORT_OPTIONS = ['Recommended', 'Price:High to Low', 'Price:Low to High', 'Popularity'];

export default function Listing({ category }) {
    const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();

    // Yahan badlav kiya hai: Array [] ki jagah null rakha hai taaki ek baar mein ek hi khule
    const [openSections, setOpenSections] = useState(null);

    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Recommended');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

    const mobileFiltersRef = useRef(null);
    const categoryName = category?.title || category?.slug?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

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

                // By default pehla filter section kholne ke liye:
                if (allGroups.length > 0) {
                    setOpenSections(allGroups[0].id);
                }
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
                const sortParam = selectedSort === 'Price:High to Low' ? '-salePrice,-regularPrice' :
                    selectedSort === 'Price:Low to High' ? 'salePrice,regularPrice' :
                        '-createdAt';

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

    // Toggle logic update: Agar wahi id click ho toh band (null), nahi toh nayi id set karein
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
                // Check if current group is open
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
                <h2 className={styles.filterTitle}>Filter</h2>
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
                            Filter
                        </button>
<div className={styles.sortWrapper}>
  <div
    className={`${styles.sortBox} ${showSort ? styles.activeSortBox : ''}`}
    onClick={() => setShowSort(!showSort)}
  >
    <span className={styles.sortLabel}>Sort By : </span>
    <span className={styles.sortValue}>{selectedSort}</span>
    
    {/* SVG Added Here */}
    <svg 
      className={`${styles.sortArrow} ${showSort ? styles.rotateArrow : ''}`} 
      width="16" height="10" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.63055 6.75943C6.23768 7.16467 5.58748 7.16467 5.1946 6.75943L0.285735 1.69607C-0.329211 1.06177 0.120255 1.54337e-07 1.00371 8.53452e-08L10.8214 -6.81352e-07C11.7049 -7.50344e-07 12.1544 1.06177 11.5394 1.69607L6.63055 6.75943Z" fill="#C4754E"/>
    </svg>
  </div>

  <div className={`${styles.dropdownMenu} ${showSort ? styles.showDropdown : ''}`}>
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
</header>

                {loading && products.length === 0 && <p className={styles.stateMsg}>Loading...</p>}
                {error && <p className={styles.stateMsg}>{error}</p>}

                <div className={styles.productGrid}>
                    {filteredProducts.map((item) => {
                        const imageUrl = formatImageUrl(item.productImage) || coffeeImg;
                        const slug = item.slug || item.id;
                        const name = item.name || '';
                        const notes = item.tagline || item.description || '';
                        const price = item.salePrice ? `AED ${item.salePrice}` : item.regularPrice ? `AED ${item.regularPrice}` : '';

                        return (
                            <Link href={`/shop/${category?.slug || 'all'}/${slug}`} key={item.id} className={styles.linkWrapper}>
                                <div className={styles.productCard}>
                                    <div className={styles.imageWrapper}>
                                        <button
                                            className={styles.wishlistIcon}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item.id); }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24"
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
                                    <div className={styles.details}>
                                        <h3 className={styles.name}>{name}</h3>
                                        <p className={styles.notes}>{notes}</p>
                                        <div className={styles.footerRow}>
                                            <span className={styles.priceTag}>{price}</span>
                                            <AddToCart
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
                                            <span className={styles.mobileText}>Shop Now</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {!loading && hasNextPage && (
                    <div className={styles.footer}>
                        <button className={styles.viewMoreBtn} onClick={handleViewMore} disabled={loading}>
                            {loading ? "Loading..." : "View More"}
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