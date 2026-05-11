"use client";
import React, { useState } from "react";
import { useCart } from "@/app/_context/CartContext";

const AddToCart = ({ product, quantity: propQuantity, onSuccess, className }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={className ? {
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
      } : {
        backgroundColor: hovered && !loading ? "#a65d3a" : "#C4754E",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 400,
        border: "none",
        padding: "12px clamp(24px, 5vw, 61.5px)",
        textAlign: "center",
        width: "fit-content",
        whiteSpace: "nowrap",
        cursor: loading ? "wait" : "pointer",
        transition: "background-color 0.2s ease",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
