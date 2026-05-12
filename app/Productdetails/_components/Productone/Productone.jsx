"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Productone.module.css';
import Image from 'next/image';
import AddToCart from '@/components/AddToCart';

import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';

import { formatImageUrl } from '@/lib/imageUtils';

export default function ProductOne({ initialProduct }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isExpandedRef = useRef(false);
  const isAtTopRef = useRef(true);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  useEffect(() => {
    // Don't attach scroll/gesture observer on mobile
    if (window.innerWidth <= 900) return;

    const onScroll = () => {
      isAtTopRef.current = window.scrollY <= 5;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    gsap.registerPlugin(Observer);

    const obs = Observer.create({
      target: window,
      type: "wheel,touch",
      tolerance: 20,
      onChange: (self) => {
        const expanded = isExpandedRef.current;
        const isAtTop = isAtTopRef.current;
        if (!expanded && self.deltaY > 0 && isAtTop) setIsExpanded(true);
        if (expanded && self.deltaY < 0 && isAtTop) setIsExpanded(false);
      },
      preventDefault: false
    });

    return () => {
      obs.kill();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (initialProduct) {
      const mappedData = {
        name: initialProduct.name,
        price: initialProduct.salePrice || initialProduct.regularPrice,
        notes: initialProduct.tastingNotes || "",
        specs: {
          origin: initialProduct.farm || "",
          process: initialProduct.process || ""
        },
        desc: initialProduct.description || "",
        image: formatImageUrl(initialProduct.productImage),
        variants: initialProduct.variants || [],
        highlights: initialProduct.productHighlights || [],
        techSpecs: {
          body: initialProduct.body || "N/A",
          aroma: initialProduct.aroma || "N/A",
          roast: initialProduct.roast || "N/A",
          altitude: initialProduct.altitude || "N/A",
          finish: initialProduct.finish || "N/A"
        }
      };

      setProduct(mappedData);
      setSelectedVariant(initialProduct.variants?.[0] || null);
      setLoading(false);
    }
  }, [initialProduct]);

  if (loading || !product) return <div className={styles.loading}>Loading...</div>;

  const displayPrice = selectedVariant
    ? (selectedVariant.variantSalePrice || selectedVariant.variantRegularPrice)
    : product.price;

  const productImage = selectedVariant?.variantImage
    ? formatImageUrl(selectedVariant.variantImage)
    : product.image;

  return (
    <div className={styles.container}>

      <div className={styles.stickyWrapper} id="sticky-section">
        <div className={styles.imageSection}>
          <div className={styles.productWrapper}>            <Image
            src={productImage}
            alt={product.name}
            width={541}
            height={541}
            className={`${styles.mainImage} ${isExpanded ? styles.imageScrolled : ''}`}
            priority
          />
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.cardWrapper}>

            {/* Card 1: Main Product Info */}
            <div className={`${styles.card} ${isExpanded ? styles.card1Hide : styles.card1Show}`}>
              <div className={styles.headerGroup}>
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.tastingNotes}>{product.notes}</p>
              </div>

              <hr className={styles.divider} />

              <div className={styles.selectionGroup}>
                <div className={styles.priceRow}>
                  <span className={styles.buyLabel}>Buy at</span>
                  <span className={styles.price}>AED {Math.round(displayPrice)}</span>
                </div>

                {product.variants.length > 0 && (
                  <div className={styles.sizeSection}>
                    <label className={styles.label}>Weight</label>
                    <div className={styles.buttonGroup}>
                      {product.variants.map((v) => (
                        <button
                          key={v.id || v.variantName}
                          className={`${styles.sizeButton} ${selectedVariant?.variantName === v.variantName ? styles.activeSize : ''}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          {v.variantName}g
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionRow}>
                <div className={styles.quantityPicker}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span style={{ margin: "0px 10px", fontFamily: "var(--font-raleway)" }}>{quantity.toString().padStart(2, '0')}</span>
                  <button onClick={() => setQuantity(q => Math.min(5, q + 1))}>+</button>
                </div>
                <AddToCart
                  product={{
                    productId: initialProduct.id,
                    name: product.name,
                    description: product.desc,
                    image: productImage,
                    tagline: product.notes,
                    variationId: selectedVariant?.id || null,
                  }}
                  quantity={quantity}
                />
              </div>

              <hr className={styles.divider} />

              <table className={styles.specsTable}>
                <tbody>
                  <tr><td>Origin</td><td className={styles.specValue}>{product.specs.origin}</td></tr>
                  {product.highlights.map((h) => (
                    <tr key={h.id || h.sectionTitle}>
                      <td>{h.sectionTitle}</td>
                      <td className={styles.specValue}>{h.items?.[0]?.point || ""}</td>
                    </tr>
                  ))}
                  <tr><td>Process</td><td className={styles.specValue}>{product.specs.process}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Card 2: Technical Specs / Description */}
            <div className={`${styles.card} ${isExpanded ? styles.card2Show : styles.card2Hide}`}>
              <p className={styles.description}>{product.desc}</p>
              <hr className={styles.divider} />
              <table className={styles.specsTables}>
                <tbody>
                  <tr><td className={styles.bulletLabel}><Dot /><p>Body</p></td><td>{product.techSpecs.body}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p>Aroma</p></td><td>{product.techSpecs.aroma}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p>Roast</p></td><td>{product.techSpecs.roast}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p>Altitude</p></td><td>{product.techSpecs.altitude}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p>Finish</p></td><td>{product.techSpecs.finish}</td></tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <div className={styles.scrollSpacer}></div>
    </div>
  );
}

function Dot() {
  return (
    <svg width="6" height="6" viewBox="0 0 8 8" fill="none" style={{ marginRight: '8px', marginTop: '6px' }}>
      <circle cx="4" cy="4" r="4" fill="#C4754E" />
    </svg>
  );
}
