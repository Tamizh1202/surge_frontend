"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./AddToCartPopup.module.css";
import { useCart } from "@/app/_context/CartContext";
import { formatImageUrl } from "@/lib/imageUtils";

function CustomSelect({ label, placeholder, options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.field}>
            <label className={styles.fieldLabel}>{label}</label>
            <div className={styles.customSelect} ref={ref}>
                <button
                    type="button"
                    className={`${styles.selectTrigger} ${open ? styles.open : ""} ${value ? styles.hasValue : ""}`}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span>{value || placeholder}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chev}>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {/* Remove {open && ...} — always render, toggle class */}
                <div className={`${styles.selectMenu} ${open ? styles.open : ""}`}>
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`${styles.selectOption} ${value === option ? styles.selected : ""}`}
                            onClick={() => { onChange(option); setOpen(false); }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProductPopup({ product, onClose }) {
    const { addToCart } = useCart();

    const variants = product?.variants || [];
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

    // Build selects dynamically from productHighlights
    const highlights = product?.productHighlights || [];
    const highlightSelections = Object.fromEntries(
        highlights.map((h) => [h.sectionTitle, h.items?.[0]?.point || ""])
    );
    const [selectedHighlights, setSelectedHighlights] = useState(highlightSelections);

    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const price = product?.salePrice
        ? `AED ${product.salePrice}`
        : product?.regularPrice
            ? `AED ${product.regularPrice}`
            : "";

    const handleSelect = (sectionTitle, value) => {
        setSelectedHighlights((prev) => ({ ...prev, [sectionTitle]: value }));
    };

    const handleAddToCart = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const imageUrl = formatImageUrl(product.productImage);
            await addToCart(product.id, quantity, selectedVariant?.id || "", {
                productId: product.id,
                name: product.name,
                description: product.description,
                image: imageUrl,
                tagline: product.tagline,
                quantity,
                variationId: selectedVariant?.id || "",
                ...selectedHighlights,
            });
            onClose();
        } catch (err) {
            console.error("Add to cart error", err);
        } finally {
            setLoading(false);
        }
    };

    // Split highlights into pairs for 2-column rows
    const highlightPairs = highlights.reduce((rows, h, i) => {
        if (i % 2 === 0) rows.push([h]);
        else rows[rows.length - 1].push(h);
        return rows;
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={styles.popupHeader}>
                    <div>
                        <h3 className={styles.popupTitle}>{product?.name}</h3>
                        <p className={styles.popupPrice}>{price}</p>
                    </div>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Row 1 — Weight + Quantity */}
                <div className={styles.row}>
                    {variants.length > 0 && (
                        <CustomSelect
                            label="Weight"
                            placeholder="Select Weight"
                            options={variants.map((v) => `${v.variantName}g`)}
                            value={selectedVariant ? `${selectedVariant.variantName}g` : ""}
                            onChange={(val) => setSelectedVariant(variants.find((v) => `${v.variantName}g` === val))}
                        />
                    )}
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Quantity</label>
                        <div className={styles.qtyControl}>
                            <button type="button" className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                            <div className={styles.qtyValue}>{String(quantity).padStart(2, "0")}</div>
                            <button type="button" className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.min(5, q + 1))} aria-label="Increase">+</button>
                        </div>
                    </div>
                </div>

                {/* Dynamic highlight rows — 2 per row */}
                {highlightPairs.map((pair, rowIdx) => (
                    <div className={styles.row} key={rowIdx}>
                        {pair.map((section) => (
                            <CustomSelect
                                key={section.id}
                                label={section.sectionTitle}
                                placeholder={`Select ${section.sectionTitle}`}
                                options={[...new Set(section.items?.map((i) => i.point) || [])]}
                                value={selectedHighlights[section.sectionTitle] || ""}
                                onChange={(val) => handleSelect(section.sectionTitle, val)}
                            />
                        ))}
                    </div>
                ))}

                {/* CTA */}
                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>

            </div>
        </div>
    );
}