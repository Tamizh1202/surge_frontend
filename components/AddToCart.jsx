"use client";
import React, { useState } from "react";
import { useCart } from "@/app/_context/CartContext";

const AddToCart = ({ product, quantity: propQuantity, onSuccess }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (loading) return;

    if (!product) {
      console.error("Product prop is required for AddToCart component");
      return;
    }

    setLoading(true);
    try {
      const productId = product.productId || product.id || product.product;
      const variationId =
        product.variationId || product.vId || product.variantId || "";
      const finalQuantity = propQuantity || product.quantity || 1;

      await addToCart(productId, finalQuantity, variationId, product);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Add to cart error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      style={{
        // width: "100%",
        backgroundColor: "#C4754E",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 400,
        border: "none",
        padding: "12px clamp(24px, 5vw, 61.5px)",
        width:"100%",
        whiteSpace: "nowrap",
        cursor: loading ? "wait" : "pointer",
        transition: "background-color 0.2s ease",
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) e.target.style.backgroundColor = "#C4754E";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.target.style.backgroundColor = "#C4754E";
      }}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
