'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './Details.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import axiosClient from "@/lib/axios";
import { formatImageUrl } from "@/lib/imageUtils";

// Fallback image
// import beveragesImg from './beverages.png';

gsap.registerPlugin(ScrollTrigger);

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
                        image: formatImageUrl(item.image?.url) || beveragesImg
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

    useEffect(() => {
        if (!loading && selectedCategory && sections.length > 0) {
            const index = sections.findIndex(s => String(s.id) === String(selectedCategory));
            if (index !== -1 && sectionsRef.current[index]) {
                const element = sectionsRef.current[index];
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    }, [selectedCategory, loading, sections]);


    useLayoutEffect(() => {
        if (loading || sections.length === 0) return;

        let mm = gsap.matchMedia();

        mm.add("(max-width: 768px)", () => {
            sectionsRef.current.forEach((section) => {
                if (!section) return;
                const itemList = section.querySelector(`.${styles.itemList}`);
                if (!itemList) return;

                const listHeight = itemList.scrollHeight;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${listHeight}`,
                        pin: true,
                        pinSpacing: false,
                        scrub: 0.05,
                    }
                });

                tl.to(itemList, { y: -listHeight, ease: "none" }, 0);
                tl.to(section, { clipPath: `inset(0px 0px ${listHeight}px 0px)`, ease: "none" }, 0);
            });
        });

        return () => mm.revert();
    }, [loading, sections]);

    const handleItemHover = (sectionIndex, item) => {
        setActiveSelection({
            id: item.id,
            image: item.image,
            sectionIndex: sectionIndex
        });
    };

    if (loading) return <div className={styles.loading}>Loading menu...</div>;
    if (sections.length === 0) {
        return (
            <div className={styles.noItems}>
                {!shopId ? "Please select a shop to view the menu." : "."}
            </div>
        );
    }

    return (
        <main ref={containerRef} className={styles.container}>
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
                                    src={activeSelection.sectionIndex === sectionIndex ? activeSelection.image : (section.items[0]?.image || beveragesImg)}
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
        </main>
    );
}
