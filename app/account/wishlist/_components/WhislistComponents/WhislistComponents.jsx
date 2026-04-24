"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./WhislistComponents.module.css";
import Image from "next/image";
import zeroWish from "./zeroWish.png";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/app/_context/WishlistContext";
import { useCart } from "@/app/_context/CartContext";
import { formatImageUrl } from "@/lib/imageUtils";
import {
  getSortedVariants,
} from "@/app/_utils/productVariants";
// import SubscriptionPopup from "@/app/shop/[category]/_components/Listing/_components/SubscriptionPopup";
// import AddToCartPopup from "@/app/_components/AddToCartPopup/AddToCartPopup";

const WishlistComponents = () => {
  const router = useRouter();
  const { items: wishlistData, loading, remove } = useWishlist();
  const { addToCart } = useCart();

  // Logic from provided snippet
  const [selectedVariations, setSelectedVariations] = useState({});
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(2);
  const popupRef = useRef(null);

  const [addingId, setAddingId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);


  useEffect(() => {
    if (wishlistData?.length > 0) {
      const initialSelections = {};
      wishlistData.forEach((item) => {
        const productDoc = item.product?.value;
        if (productDoc?.variants?.length > 0) {
          const sorted = getSortedVariants(productDoc);
          initialSelections[item.id] = sorted[0];
        }
      });
      setSelectedVariations(initialSelections);
    }
  }, [wishlistData]);

  useEffect(() => {
    if (!showSubscribePopup) return;
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSubscribePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubscribePopup]);

  const handleRemove = async (productId) => {
    await remove(productId);
  };

  const handleProductClick = (slug, category) => {
    router.push(`/shop/${category}/${slug}`);
  };

  const handleOpenCartPopup = (item) => {
    setProductForCart(item);
    setShowCartPopup(true);
  };

  const handleOpenSubscribePopup = (product) => {
    let subFreqs = [];
    let discount = 0;
    if (product.hasVariantOptions && product.variants?.length > 0) {
      const subVariant = product.variants.find((v) => v.hasVariantSub) || product.variants[0];
      subFreqs = subVariant.subFreq || [];
      discount = subVariant.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        variant: subVariant,
        isVariant: true,
        discount,
        subFreqs,
      });
    } else {
      subFreqs = product.subFreq || [];
      discount = product.subscriptionDiscount || 0;
      setSelectedProduct({
        parent: product,
        isVariant: false,
        discount,
        subFreqs,
      });
    }
    if (subFreqs.length > 0) setSelectedFrequency(subFreqs[0]);
    setSelectedQuantity(2);
    setShowSubscribePopup(true);
  };

  const handleSubscriptionCheckout = () => {
    if (!selectedProduct || !selectedFrequency) return;
    const params = new URLSearchParams({
      mode: "subscription",
      productId: selectedProduct.parent.id,
      subscriptionId: selectedFrequency.id || selectedFrequency._id || "",
      variationId: selectedProduct.isVariant ? selectedProduct.variant.id : "",
      quantity: selectedQuantity.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const getFrequencyLabel = (freq) => {
    if (!freq) return "";
    const plural = freq.duration > 1 ? "s" : "";
    return `Every ${freq.duration} ${freq.interval}${plural}`;
  };

  const getVariationImage = (item) => {
    const selectedVariation = selectedVariations[item.id];
    if (selectedVariation?.variantImage) {
      return formatImageUrl(selectedVariation.variantImage);
    }
    const productDoc = item.product?.value;
    return formatImageUrl(productDoc?.variants?.[0]?.variantImage) || formatImageUrl(productDoc?.productImage);
  };

  const getVariationPrice = (item, productDoc) => {
    const selectedVariation = selectedVariations[item.id];
    const price = selectedVariation ? (selectedVariation.variantSalePrice || selectedVariation.variantRegularPrice || 0) : (productDoc?.salePrice || productDoc?.regularPrice || 0);
    return `AED ${parseFloat(price).toFixed(2)}`;
  };

  const getRegularPrice = (item, productDoc) => {
    const selectedVariation = selectedVariations[item.id];
    if (selectedVariation) {
      const regular = selectedVariation.variantRegularPrice;
      const sale = selectedVariation.variantSalePrice;
      if (regular && sale && parseFloat(regular) > parseFloat(sale)) return `AED ${parseFloat(regular).toFixed(2)}`;
    }
    if (productDoc?.salePrice && productDoc?.regularPrice && parseFloat(productDoc.regularPrice) > parseFloat(productDoc.salePrice)) {
      return `AED ${parseFloat(productDoc.regularPrice).toFixed(2)}`;
    }
    return null;
  };

  const handleAddToCart = async (productDoc, itemId) => {
    if (addingId) return;

    setAddingId(itemId);
    setActiveProduct(productDoc);
    try {
      // Use existing selection or fallback to first variant
      const selectedVariation = selectedVariations[itemId] || productDoc.variants?.[0];

      await addToCart(productDoc.id, 1, selectedVariation?.id || null, {
        name: productDoc.name,
        image: getVariationImage({ id: itemId, product: { value: productDoc } }),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingId(null);
    }
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
            <p className={styles.EmptySubText}>Explore more and shortlist some items.</p>
            <button className={styles.ShopNow} onClick={() => router.push("/shop")}>Shop now</button>
          </div>
        ) : (
          <div className={styles.Bottom}>
            {wishlistData.map((item) => {
              const product = item.product?.value;
              if (!product) return null;
              const isAdding = addingId === item.id;
              const imageUrl = getVariationImage(item);

              return (
                <div key={item.id} className={styles.Card}>
                  <div className={styles.RemoveIcon} onClick={() => handleRemove(product.id)}>✕</div>
                  <div className={styles.ImgContainer} onClick={() => handleProductClick(product.slug, product.categories?.slug)} style={{ cursor: 'pointer' }}>
                    <Image src={imageUrl} alt={product.name} width={295} height={339} className={styles.Img} />
                  </div>
                  <div className={styles.CardContent}>
                    <h4 className={styles.ProductName} onClick={() => handleProductClick(product.slug, product.categories?.slug)} style={{ cursor: 'pointer' }}>
                      {product.name} {product.tagline}
                    </h4>
                    <p className={styles.Description}>{product.description}</p>
                    <div className={styles.PriceRow}>
                      <span className={styles.CurrentPrice}>{getVariationPrice(item, product)}</span>
                      <button
                        className={styles.AddToCartBtn}
                        onClick={() => handleAddToCart(product, item.id)}
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

      {/* <SubscriptionPopup
        showSubscribePopup={showSubscribePopup}
        setShowSubscribePopup={setShowSubscribePopup}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedFrequency={selectedFrequency}
        setSelectedFrequency={setSelectedFrequency}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleSubscriptionCheckout={handleSubscriptionCheckout}
        getFrequencyLabel={getFrequencyLabel}
        popupRef={popupRef}
        styles={styles}
      /> */}

    </div>
  );
};

export default WishlistComponents;