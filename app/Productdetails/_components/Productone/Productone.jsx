"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './Productone.module.css';
import Image from 'next/image';
import AddToCart from '@/components/AddToCart';

import beanImg from './packet.png';
import capImg from './cap.png';
import dripImg from './d.png';
import merchImg from './m.png';

import { formatImageUrl } from '@/lib/imageUtils';

const TYPE_CONFIG = {
  beans: {
    defaultImg: beanImg,
    label: "Size",
    options: ['250 gm', '500 gm', '1 kg'],
    specLabel: "Variety"
  },
  capsule: {
    defaultImg: capImg,
    label: "Pack Count",
    options: ['10 Pods', '30 Pods', '50 Pods'],
    specLabel: "Compatibility"
  },
  drip: {
    defaultImg: dripImg,
    label: "Quantity",
    options: ['5 Bags', '10 Bags', '20 Bags'],
    specLabel: "Roast"
  },
  merch: {
    defaultImg: merchImg,
    label: "Select Size",
    options: ['S', 'M', 'L', 'XL'],
    specLabel: "Material"
  }
};

export default function ProductOne({ initialProduct }) {
  const params = useParams();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollPhaseRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e) => {
      const phase = scrollPhaseRef.current;

      if (phase === 0 && e.deltaY > 0) {
        e.preventDefault();
        setIsExpanded(true);
        scrollPhaseRef.current = 2;
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      }

      else if (phase === 2 && e.deltaY < 0) {
        e.preventDefault();
        setIsExpanded(false);
        scrollPhaseRef.current = 0;
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  // Map initialProduct to local state
  useEffect(() => {
    if (initialProduct) {
      const categorySlug = initialProduct.categories?.slug || "";
      let productType = 'beans';
      if (categorySlug.includes('capsule')) productType = 'capsule';
      else if (categorySlug.includes('drip')) productType = 'drip';
      else if (categorySlug.includes('merch')) productType = 'merch';

      const mappedData = {
        name: initialProduct.name,
        price: initialProduct.salePrice || initialProduct.regularPrice,
        type: productType,
        notes: initialProduct.tastingNotes || "",
        specs: {
          origin: initialProduct.farm || "",
          val: productType === 'beans' ? (initialProduct.variety || "") : (initialProduct.material || ""),
          process: initialProduct.process || ""
        },
        desc: initialProduct.description || "",
        image: formatImageUrl(initialProduct.productImage),
        variants: initialProduct.variants || [],
        techSpecs: {
          body: initialProduct.body || "N/A",
          aroma: initialProduct.aroma || "N/A",
          roast: initialProduct.roast || "N/A",
          altitude: initialProduct.altitude || "N/A",
          finish: initialProduct.finish || "N/A"
        }
      };

      setProduct(mappedData);

      if (initialProduct.variants && initialProduct.variants.length > 0) {
        setSelectedSize(initialProduct.variants[0].variantName);
      } else {
        setSelectedSize(TYPE_CONFIG[productType].options[0]);
      }

      setLoading(false);
    }
  }, [initialProduct]);

  if (loading || !product) return <div className={styles.loading}>Loading...</div>;

  const config = TYPE_CONFIG[product.type] || TYPE_CONFIG.beans;
  const currentVariant = product.variants.find(v => v.variantName === selectedSize);
  const displayPrice = currentVariant
    ? (currentVariant.variantSalePrice || currentVariant.variantRegularPrice)
    : product.price;

  const productImage = currentVariant?.variantImage
    ? formatImageUrl(currentVariant.variantImage)
    : (product.image || config.defaultImg);

  return (
    <div className={styles.container}>

      <div className={styles.stickyWrapper} id="sticky-section">
        <div className={styles.imageSection}>
          <div className={styles.productWrapper}>
            <Image
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
                  <span className={styles.price}>AED {Math.round(displayPrice * quantity)}</span>
                </div>

                <div className={styles.sizeSection}>
                  <label className={styles.label}>{config.label}</label>
                  <div className={styles.buttonGroup}>
                    {product.variants.length > 0 ? (
                      product.variants.map((v) => (
                        <button
                          key={v.id || v.variantName}
                          className={`${styles.sizeButton} ${selectedSize === v.variantName ? styles.activeSize : ''}`}
                          onClick={() => setSelectedSize(v.variantName)}
                        >
                          {v.variantName}
                        </button>
                      ))
                    ) : (
                      config.options.map((s) => (
                        <button
                          key={s}
                          className={`${styles.sizeButton} ${selectedSize === s ? styles.activeSize : ''}`}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.actionRow}>
                <div className={styles.quantityPicker}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity.toString().padStart(2, '0')}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <AddToCart
                  product={{
                    productId: initialProduct.id,
                    name: product.name,
                    description: product.desc,
                    image: productImage,
                    tagline: product.notes,
                    variationId: currentVariant?.id || initialProduct.variants?.[0]?.id || null,
                  }}
                  quantity={quantity}
                />


              </div>


              <hr className={styles.divider} />

              <table className={styles.specsTable}>
                <tbody>
                  <tr><td>Origin</td><td className={styles.specValue}>{product.specs.origin}</td></tr>
                  <tr><td>{config.specLabel}</td><td className={styles.specValue}>{product.specs.val}</td></tr>
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
                  <tr><td className={styles.bulletLabel}><Dot /><p>Body </p></td><td>{product.techSpecs.body}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p> Aroma </p></td><td>{product.techSpecs.aroma}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p> Roast</p></td><td>{product.techSpecs.roast}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p> Altitude</p></td><td>{product.techSpecs.altitude}</td></tr>
                  <tr><td className={styles.bulletLabel}><Dot /><p> Finish</p></td><td>{product.techSpecs.finish}</td></tr>
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