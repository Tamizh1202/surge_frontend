'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './Details.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";

// Fallback image
// Fallback image replaced with public asset

export default function Details() {
    const searchParams = useSearchParams();
    const shopId = searchParams.get("shop");
    const selectedCategory = searchParams.get("category");

    const containerRef = useRef(null);
    const sectionsRef = useRef([]);

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSelection, setActiveSelection] = useState({
        id: null,
        image: null,
        sectionIndex: 0
    });

    useEffect(() => {
        const fetchMenuItems = async () => {
            if (!shopId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await axiosClient.get(`/api/shop/${shopId}/menu-items?page=1&limit=100`);
                const items = response.data.items || [];

                // Group by category
                const groups = items.reduce((acc, item) => {
                    const catId = item.category?.id;
                    const catTitle = item.category?.title || 'Other';
                    if (!acc[catId]) {
                        acc[catId] = {
                            id: catId,
                            title: catTitle,
                            items: []
                        };
                    }
                    acc[catId].items.push({
                        id: item.id,
                        name: item.name,
                        price: item.salePrice ? `AED ${item.salePrice}` : item.price ? `AED ${item.price}` : '',
                        note: item.tagline || '',
                        image: formatImageUrl(item.image?.url) || '/coff.png'
                    });
                    return acc;
                }, {});

                const dynamicSections = Object.values(groups);
                setSections(dynamicSections);

                if (dynamicSections.length > 0 && dynamicSections[0].items.length > 0) {
                    setActiveSelection({
                        id: dynamicSections[0].items[0].id,
                        image: dynamicSections[0].items[0].image,
                        sectionIndex: 0
                    });
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, [shopId]);

    const prevCategoryRef = useRef(undefined);

    useEffect(() => {
        if (loading || sections.length === 0) return;

        const prev = prevCategoryRef.current;
        prevCategoryRef.current = selectedCategory;

        // First data load — just record state, never auto-scroll
        if (prev === undefined) return;

        // Category didn't change (loading/sections settled), don't scroll
        if (selectedCategory === prev || !selectedCategory) return;

        const index = sections.findIndex(s => String(s.id) === String(selectedCategory));
        if (index !== -1 && sectionsRef.current[index]) {
            const element = sectionsRef.current[index];
            if (window.__lenis) {
                window.__lenis.scrollTo(element, { offset: -80, immediate: false });
            } else {
                const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        }
    }, [selectedCategory, loading, sections]);


    useEffect(() => {
        if (loading || sections.length === 0) return;

        gsap.registerPlugin(ScrollTrigger);
        let mm = gsap.matchMedia();
        let timeoutId;

        mm.add("(max-width: 768px)", () => {
            sectionsRef.current.forEach((section) => {
                if (!section) return;
                const itemList = section.querySelector(`.${styles.itemList}`);
                if (!itemList) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${itemList.scrollHeight}`,
                        pin: true,
                        pinSpacing: false,
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                    }
                });

                // Function values are re-read on every invalidate/refresh
                tl.to(itemList, { y: () => -itemList.scrollHeight, ease: "none" }, 0);
                tl.to(section, { clipPath: () => `inset(0px 0px ${itemList.scrollHeight}px 0px)`, ease: "none" }, 0);
            });
        });

        // Allmenu fetches concurrently and changes page height when it resolves.
        // 600ms covers its two API calls settling and repainting.
        timeoutId = setTimeout(() => ScrollTrigger.refresh(), 600);

        return () => {
            clearTimeout(timeoutId);
            mm.revert();
        };
    }, [loading, sections]);

    const handleItemHover = (sectionIndex, item) => {
        setActiveSelection({
            id: item.id,
            image: item.image,
            sectionIndex: sectionIndex
        });
    };

    if (loading) return (
        <div className={styles.skeletonSection}>
            <div className={styles.skeletonCatTitle} />
            <div className={styles.skeletonMenuContainer}>
                <div className={styles.skeletonItemList}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.skeletonRow}>
                            <div className={styles.skeletonRowLeft}>
                                <div className={styles.skeletonLine} />
                                <div className={styles.skeletonLineShort} />
                            </div>
                            <div className={styles.skeletonPrice} />
                        </div>
                    ))}
                </div>
                <div className={styles.skeletonImg} />
            </div>
        </div>
    );
    if (sections.length === 0) {
        return (
            <div className={styles.noItems}>
                {/* {!shopId ? "Please select a shop to view the menu." : "."} */}
            </div>
        );
    }

    return (
        <section ref={containerRef} className={styles.container}>
            {sections.map((section, sectionIndex) => (
                <section
                    key={section.id || sectionIndex}
                    ref={(el) => (sectionsRef.current[sectionIndex] = el)}
                    className={styles.selectedSection}
                >
                    <h2 className={styles.categoryTitle}>{section.title}</h2>

                    <div className={styles.menuContainer}>
                        <div className={styles.itemList}>
                            {section.items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${styles.menuItem} ${activeSelection.id === item.id ? styles.activeItem : ''}`}
                                    onMouseEnter={() => handleItemHover(sectionIndex, item)}
                                    onClick={() => handleItemHover(sectionIndex, item)}
                                >
                                    <div className={styles.itemInfo}>
                                        <h1>{item.name}</h1>
                                        <p>{item.note}</p>
                                    </div>
                                    <span className={styles.price}>{item.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.imageWrapper}>
                            <div
                                key={activeSelection.sectionIndex === sectionIndex ? activeSelection.id : `default-${sectionIndex}`}
                                className={styles.imageAnimWrapper}
                            >
                                <Image
                                    src={activeSelection.sectionIndex === sectionIndex ? activeSelection.image : (section.items[0]?.image || '/coff.png')}
                                    alt={section.title}
                                    width={541}
                                    height={541}
                                    className={styles.menuImage}
                                    priority={sectionIndex === 0}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </section>
    );
}