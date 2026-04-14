"use client";
import React, { useState } from "react";
import styles from "./WhislistComponents.module.css";
import Image from "next/image";
import zeroWish from "./zeroWish.png";
// Import your image here since it is not in the public folder
import cof from "./cof.png"; 
import { useRouter } from "next/navigation";

/**
 * UI-only version with Mock Data for styling purposes.
 */
const WishlistComponents = () => {
  const router = useRouter();

  // Mock JSON data
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
          productImage: cof, // Using the imported variable
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
          productImage: cof, // Using the imported variable
          categories: { slug: "limited-edition" },
          inStock: true,
        }
      }
    }
  ]);

  const [loading, setLoading] = useState(false);

  const handleRemoveMock = (id) => {
    setWishlistData((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.TopLeft}><h3>Wishlist</h3></div>
          <div className={styles.EmptyState}>
            <p className={styles.EmptyText}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Top}>
          <div className={styles.TopLeft}>
            <h3>Wishlist</h3>
          </div>
          <div className={styles.WhishListCount}>
            <p>({wishlistData.length} items)</p>
          </div>
        </div>

        {wishlistData.length === 0? (
          <div className={styles.EmptyState}>
            <Image 
              src={zeroWish} 
              alt="No products" 
              width={140} 
              height={140} 
              priority
            />
            <p className={styles.EmptyText}>Your wish list is empty.</p>
            <button 
              className={styles.ShopNow} 
              onClick={() => router.push("/shop")}
            >
              Shop now
            </button>
          </div>
        ) : (
          <div className={styles.Bottom}>
            {wishlistData.map((item) => {
              const product = item.product.value;
              return (
                <div key={item.id} className={styles.Card}>
                  {/* Remove Button (X) */}
                  <div 
                    className={styles.RemoveIcon} 
                    onClick={() => handleRemoveMock(item.id)}
                  >
                    ✕
                  </div>

                  <div className={styles.ImgContainer}>
                    <Image 
                      src={product.productImage} 
                      alt={product.name}
                      width={295}
                      height={339}
                      className={styles.Img}
                    />
                  </div>

                  <div className={styles.CardContent}>
                    <h4 className={styles.ProductName}>{product.name} {product.tagline}</h4>
                    <p className={styles.Description}>{product.description}</p>
                    
                    <div className={styles.PriceRow}>
                        <span className={styles.CurrentPrice}>AED {product.salePrice.toFixed(2)}</span>
                        <button className={styles.AddToCartBtn}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistComponents;