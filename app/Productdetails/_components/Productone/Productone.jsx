"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './Productone.module.css';
import Image from 'next/image';

import beanImg from './packet.png'; 
import capImg from './cap.png';
import dripImg from './d.png'; 
import merchImg from './m.png';   


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

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProductData = () => {
   
      const isCapsule = slug.includes('nespresso') || slug.includes('pods');
      const isDrip = slug.includes('drip');
      const isMerch = slug.includes('shirt') || slug.includes('mug') || slug.includes('merch');
      
      let productType = 'beans';
      if (isCapsule) productType = 'capsule';
      else if (isDrip) productType = 'drip';
      else if (isMerch) productType = 'merch';

      let priceValue = 65; 
      if (slug.includes('-0')) priceValue = 55;
      if (slug.includes('-3')) priceValue = 58;
      if (slug.includes('-2')) priceValue = 70;
      if (slug.includes('ethiopia')) priceValue = 75;

      const generatedData = {
        name: slug.replace(/-/g, ' ').toUpperCase(),
        price: priceValue,
        type: productType,
        notes: isCapsule ? "Floral, berry, bright" : "Citrus, nutty, chocolate",
        specs: { 
          origin: slug.split('-')[0].toUpperCase(), 
          val: isCapsule ? "Nespresso Original" : "Premium Arabica", 
          process: slug.includes('ethiopia') ? "Washed" : "Natural" 
        },
        desc: "A high-altitude heirloom from Guji, bright and expressive with delicate floral lift and stone-fruit sweetness. Silky in body with a tea-like finish, it unfolds in layers of citrus zest, white blossom aromatics, and subtle honeyed notes. . Perfect for slow brews and mindful sips, this cup is both refreshing and nuanced — a beautiful expression of terroir and craft."
      };

      setProduct(generatedData);
      setSelectedSize(TYPE_CONFIG[productType].options[0]);
      setLoading(false);
    };

    fetchProductData();
  }, [slug]);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const config = TYPE_CONFIG[product.type] || TYPE_CONFIG.beans;

  
  const getCalculatedPrice = () => {
    let base = product.price;
    if (selectedSize === '500 gm' || selectedSize === '30 Pods' || selectedSize === '10 Bags') base = base * 1.8;
    if (selectedSize === '1 kg' || selectedSize === '50 Pods' || selectedSize === '20 Bags') base = base * 3.2;
    return Math.round(base * quantity);
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.imageSection} 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.productWrapper}>
          <Image src={config.defaultImg} alt={product.name} className={styles.mainImage} priority />
        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.cardWrapper}>
          
          <div className={`${styles.card} ${isExpanded ? styles.card1Hide : styles.card1Show}`}>
            <div className={styles.headerGroup}>
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.tastingNotes}>{product.notes}</p>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.selectionGroup}>
              <div className={styles.priceRow}>
                <span className={styles.buyLabel}>Buy at</span>
                <span className={styles.price}>AED {getCalculatedPrice()}</span>
              </div>
              
              <div className={styles.sizeSection}>
                <label className={styles.label}>{config.label}</label>
                <div className={styles.buttonGroup}>
                  {config.options.map((s) => (
                    <button
                      key={s}
                      className={`${styles.sizeButton} ${selectedSize === s ? styles.activeSize : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSize(s); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.actionRow}>
              <div className={styles.quantityPicker}>
                <button onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}>−</button>
                <span>{quantity.toString().padStart(2, '0')}</span>
                <button onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}>+</button>
              </div>
              <button className={styles.addToCart} onClick={(e) => e.stopPropagation()}>Add to Cart</button>
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

          <div className={`${styles.card} ${isExpanded ? styles.card2Show : styles.card2Hide}`}>
            <p className={styles.description}>{product.desc}</p>
            <hr className={styles.divider} />
            <table className={styles.specsTables}>
              <tbody>
                <tr><td className={styles.bulletLabel}><Dot /><p>Body </p></td><td>Creamy, velvety, and comfortably full.</td></tr>
                <tr><td className={styles.bulletLabel}><Dot /><p> Aroma </p></td><td>{product.notes}</td></tr>
                <tr><td className={styles.bulletLabel}><Dot />  <p>  Roast</p></td><td>Medium roast develops cocoa richness.</td></tr>
                <tr><td className={styles.bulletLabel}><Dot />  <p>  Altitude</p></td><td>1,200–1,800 m, steady maturation builds sweetness.</td></tr>
                <tr><td className={styles.bulletLabel}><Dot /><p> Finish</p></td><td>Long, nutty, and gently sweet with lingering chocolate.</td></tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

function Dot() {
  return (
    <svg width="6" height="6" viewBox="0 0 8 8" fill="none" style={{marginRight: '8px'}}>
      <circle cx="4" cy="4" r="4" fill="#C4754E"/>
    </svg>
  );
}