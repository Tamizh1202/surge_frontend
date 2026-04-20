"use client";
import React, { useState } from "react";
import styles from "./WhislistComponents.module.css";
import Image from "next/image";
import zeroWish from "./zeroWish.png";
import cof from "./cof.png";
import { useRouter } from "next/navigation";
import Link from "next/link"; // For the "View Cart" button in popup

const WishlistComponents = () => {
  const router = useRouter();

  const [wishlistData, setWishlistData] = useState([
    {
      id: "wish_01",
      product: {
        value: {
          id: "prod_01",
          name: "Indonesia Banner Mariah",
          tagline: "Triple Wet Hull",
          slug: "indonesia-banner-mariah",
          description: "Citrus, nutty, chocolate",
          regularPrice: 75.00,
          salePrice: 60.00,
          productImage: cof,
          categories: { slug: "coffee-beans" },
          inStock: true,
        }
      }
    },
    {
      id: "wish_02",
      product: {
        value: {
          id: "prod_02",
          name: "Indonesia Meriah",
          tagline: "Anaerobic Natural",
          slug: "indonesia-meriah-anaerobic",
          description: "Floral, fruity, complex",
          regularPrice: 80.00,
          salePrice: 65.00,
          productImage: cof,
          categories: { slug: "limited-edition" },
          inStock: true,
        }
      }
    }, 
    {
      id: "wish_02",
      product: {
        value: {
          id: "prod_02",
          name: "Indonesia Meriah",
          tagline: "Anaerobic Natural",
          slug: "indonesia-meriah-anaerobic",
          description: "Floral, fruity, complex",
          regularPrice: 80.00,
          salePrice: 65.00,
          productImage: cof,
          categories: { slug: "limited-edition" },
          inStock: true,
        }
      }
    },{
      id: "wish_02",
      product: {
        value: {
          id: "prod_02",
          name: "Indonesia Meriah",
          tagline: "Anaerobic Natural",
          slug: "indonesia-meriah-anaerobic",
          description: "Floral, fruity, complex",
          regularPrice: 80.00,
          salePrice: 65.00,
          productImage: cof,
          categories: { slug: "limited-edition" },
          inStock: true,
        }
      }
    },
    {
      id: "wish_03",
      product: {
        value: {
          id: "prod_03",
          name: "Indian Meriah",
          tagline: "Anaerobic Natural",
          slug: "indonesia-meriah-anaerobic",
          description: "Floral, fruity, complex",
          regularPrice: 80.00,
          salePrice: 65.00,
          productImage: cof,
          categories: { slug: "limited-edition" },
          inStock: true,
        }
      }
    }
  ]);

  const [loading, setLoading] = useState(false);

  // New States for "Added to Cart" checking
  const [addingId, setAddingId] = useState(null); // Tracks which specific button is "Adding..."
  const [showPopup, setShowPopup] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const handleRemoveMock = (id) => {
    setWishlistData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (product) => {
    if (addingId) return;

    setAddingId(product.id);
    setActiveProduct(product);

    // Simulation of adding to cart
    setTimeout(() => {
      setAddingId(null);
      setShowPopup(true);

      // Auto-hide popup after 4 seconds
      setTimeout(() => setShowPopup(false), 4000);
    }, 800);
  };

  if (loading) {
    return (
      <div className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.TopLeft}><h3>Wishlist</h3></div>
          <div className={styles.EmptyState}><p className={styles.EmptyText}>Loading...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Main} style={{ position: 'relative' }}>
      <div className={styles.MainContainer}>
        <div className={styles.Top}>
          <div className={styles.TopLeft}><h3>Wishlist</h3></div>
          <div className={styles.WhishListCount}><p>({wishlistData.length} items)</p></div>
        </div>

        {wishlistData.length === 0 ? (
          <div className={styles.EmptyState}>
            <Image src={zeroWish} alt="No products" width={140} height={140} priority />
            <p className={styles.EmptyText}>Your wish list is empty.</p>
            <button className={styles.ShopNow} onClick={() => router.push("/shop")}>Shop now</button>
          </div>
        ) : (
          <div className={styles.Bottom}>
            {wishlistData.map((item) => {
              const product = item.product.value;
              const isAdding = addingId === product.id;

              return (
                <div key={item.id} className={styles.Card}>
                  <div className={styles.RemoveIcon} onClick={() => handleRemoveMock(item.id)}>✕</div>
                  <div className={styles.ImgContainer}>
                    <Image src={product.productImage} alt={product.name} width={295} height={339} className={styles.Img} />
                  </div>
                  <div className={styles.CardContent}>
                    <h4 className={styles.ProductName}>{product.name} {product.tagline}</h4>
                    <p className={styles.Description}>{product.description}</p>
                    <div className={styles.PriceRow}>
                      <span className={styles.CurrentPrice}>AED {product.salePrice.toFixed(2)}</span>
                      <button
                        className={styles.AddToCartBtn}
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdding}
                        style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
                      >
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- ADDED TO CART POPUP --- */}
      {showPopup && activeProduct && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '320px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          padding: '20px',
          zIndex: 10000,
          borderRadius: '4px',
          border: '1px solid #f0f0f0',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontWeight: '600', fontSize: '16px', color: '#1a1a1a' }}>Added to Cart</span>
            <button onClick={() => setShowPopup(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', flexShrink: 0 }}>
              <Image src={activeProduct.productImage} alt="Product" width={60} height={60} style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', lineHeight: '1.4' }}>{activeProduct.name}</div>
              <div style={{ fontSize: '12px', color: '#777' }}>{activeProduct.tagline}</div>
            </div>
          </div>

          <button
            onClick={() => router.push('/cart')}
            style={{
              width: '100%',
              backgroundColor: '#C4815E',
              color: 'white',
              border: 'none',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Basic animation style */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WishlistComponents;