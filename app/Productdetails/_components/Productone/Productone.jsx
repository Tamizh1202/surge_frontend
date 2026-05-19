"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Productone.module.css';
import Image from 'next/image';
import AddToCart from '@/components/AddToCart';

import { gsap } from 'gsap';
import { Observer } from 'gsap/all';

import { formatImageUrl } from '@/lib/imageUtils';

function CustomSelect({ label, placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!options.length) return null;

  return (
    <div className={styles.dropdownField}>
      <label className={styles.label}>{label}</label>
      <div className={styles.customSelect} ref={ref}>
        <button
          type="button"
          className={`${styles.selectTrigger} ${open ? styles.selectOpen : ''} ${value ? styles.selectHasValue : ''}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{value || placeholder}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.selectChevron}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div className={`${styles.selectMenu} ${open ? styles.selectMenuOpen : ''}`}>
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`${styles.selectOption} ${value === option ? styles.selectedOption : ''}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductOne({ initialProduct }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedHighlights, setSelectedHighlights] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const rightPanelRef = useRef(null); // add this ref
  const isExpandedRef = useRef(false);
  const isAtTopRef = useRef(true);
  const card2Ref = useRef(null);
  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);
  //  const collapseAccRef = useRef(0);
  const scrollDepthRef = useRef(0);
  const collapseAccRef = useRef(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) return;
    gsap.registerPlugin(Observer);

    // inside your useEffect, replace the entire Observer:
    const obs = Observer.create({
      target: window,
      type: "wheel,touch",
      tolerance: 20,
      onChange: (self) => {
        const expanded = isExpandedRef.current;

        if (!expanded && self.deltaY > 0) {
          setIsExpanded(true);
          scrollDepthRef.current = 0;
          collapseAccRef.current = 0;
          return;
        }

        if (expanded) {
          if (self.deltaY > 0) {
            // scrolling down inside page B — accumulate depth, reset collapse
            scrollDepthRef.current += self.deltaY;
            collapseAccRef.current = 0;
          } else {
            // scrolling up — drain depth first
            scrollDepthRef.current = Math.max(0, scrollDepthRef.current + self.deltaY);

            if (scrollDepthRef.current <= 0) {
              // only NOW at the top — start accumulating overscroll
              collapseAccRef.current += Math.abs(self.deltaY);
              if (collapseAccRef.current >= 80) {
                setIsExpanded(false);
                scrollDepthRef.current = 0;
                collapseAccRef.current = 0;
              }
            } else {
              collapseAccRef.current = 0; // still mid-page, do nothing
            }
          }
        }
      },
      preventDefault: false
    });

    return () => obs.kill();
  }, []);

  useEffect(() => {
    if (initialProduct) {
      const techSpecs = {
        body: initialProduct.body || null,
        aroma: initialProduct.aroma || null,
        roast: initialProduct.roast || null,
        altitude: initialProduct.altitude || null,
        finish: initialProduct.finish || null,
      };

      const mappedData = {
        name: initialProduct.name || initialProduct.title || "",
        price: initialProduct.salePrice || initialProduct.regularPrice || null,
        notes: initialProduct.tastingNotes || "",
        specs: [
          initialProduct.farm && { label: "Origin", value: initialProduct.farm },
          ...(initialProduct.productHighlights || []).map(h => ({
            label: h.sectionTitle,
            value: h.items?.[0]?.point || "",
            id: h.id || h.sectionTitle,
          })),
          initialProduct.process && { label: "Process", value: initialProduct.process },
        ].filter(Boolean),
        desc: initialProduct.description || "",
        image: formatImageUrl(initialProduct.productImage || initialProduct.image),
        variants: initialProduct.variants || [],
        highlights: initialProduct.productHighlights || [],
        techSpecs: Object.values(techSpecs).some(Boolean) ? techSpecs : null,
      };

      setProduct(mappedData);
      setSelectedVariant(initialProduct.variants?.[0] || null);
      setSelectedHighlights(
        Object.fromEntries(
          (initialProduct.productHighlights || []).map((highlight) => [
            highlight.sectionTitle,
            highlight.items?.[0]?.point || '',
          ])
        )
      );
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

  const handleHighlightSelect = (sectionTitle, value) => {
    setSelectedHighlights((current) => ({
      ...current,
      [sectionTitle]: value,
    }));
  };

  const highlightDropdowns = product.highlights
    .map((section) => ({
      ...section,
      options: [...new Set(section.items?.map((item) => item.point).filter(Boolean) || [])],
    }))
    .filter((section) => section.sectionTitle && section.options.length > 0);

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
          <div className={styles.cardWrapper} ref={rightPanelRef}>

            {/* Card 1: Main Product Info */}
            <div className={`${styles.card} ${isExpanded ? styles.card1Hide : styles.card1Show}`}>
              <div className={styles.headerGroup}>
                <h1 className={styles.title}>{product.name}</h1>
                {product.notes && <p className={styles.tastingNotes}>{product.notes}</p>}
              </div>

              <hr className={styles.divider} />

              {(displayPrice || product.variants.length > 0) && (
                <div className={styles.selectionGroup}>
                  {displayPrice && (
                    <div className={styles.priceRow}>
                      <span className={styles.buyLabel}>Buy at</span>
                      <span className={styles.price}>AED {Math.round(displayPrice)}</span>
                    </div>
                  )}

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
              )}

              {highlightDropdowns.length > 0 && (
                <div className={styles.highlightSelectGrid}>
                  {highlightDropdowns.map((section) => (
                    <CustomSelect
                      key={section.id || section.sectionTitle}
                      label={section.sectionTitle}
                      placeholder={`Select ${section.sectionTitle}`}
                      options={section.options}
                      value={selectedHighlights[section.sectionTitle] || ''}
                      onChange={(value) => handleHighlightSelect(section.sectionTitle, value)}
                    />
                  ))}
                </div>
              )}

              {displayPrice && (
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
                      productHighlights: product.highlights,
                      ...selectedHighlights,
                    }}
                    quantity={quantity}
                  />
                </div>
              )}

              {product.specs.length > 0 && (
                <>
                  <hr className={styles.divider} />
                  <table className={styles.specsTable}>
                    <tbody>
                      {product.specs.map((s) => (
                        <tr key={s.id || s.label}>
                          <td>{s.label}</td>
                          <td className={styles.specValue}>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            {/* Card 2: Technical Specs / Description */}
            {(product.desc || product.techSpecs) && (
              <div
                className={`${styles.card} ${isExpanded ? styles.card2Show : styles.card2Hide}`}
                ref={card2Ref}   // ← here
              >
                {product.desc && <p className={styles.description}>{product.desc}</p>}
                {product.techSpecs && (
                  <>
                    <hr className={styles.divider} />
                    <table className={styles.specsTables}>
                      <tbody>
                        {Object.entries(product.techSpecs).map(([key, val]) =>
                          val ? (
                            <tr key={key}>
                              <td className={styles.bulletLabel}><Dot /><p>{key.charAt(0).toUpperCase() + key.slice(1)}</p></td>
                              <td>{val}</td>
                            </tr>
                          ) : null
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}

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
