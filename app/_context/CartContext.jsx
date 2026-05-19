"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  makeCartItemKey,
} from "@/utils/guestCartUtils";
import axiosClient from "@/lib/axios";
import toast from "react-hot-toast";
import { addToCartToast } from "./_components/addToCartToast";

const CartContext = createContext(null);

const RESERVED_DETAIL_KEYS = new Set([
  "productId",
  "id",
  "product",
  "name",
  "description",
  "image",
  "tagline",
  "quantity",
  "variationId",
  "vId",
  "variantId",
]);

const SELECTIONS_CACHE_KEY = "cartSelectionsCache";
const HIGHLIGHTS_CACHE_KEY = "cartHighlightsCache";
// Tracks virtual per-highlights splits for authenticated users whose server merges product+vId
const SPLITS_CACHE_KEY = "cartSplitsCache";

const loadSplitsForItem = (product, vId) => {
  if (typeof window === "undefined") return null;
  try {
    const cache = JSON.parse(localStorage.getItem(SPLITS_CACHE_KEY) || "{}");
    const key = `${product}:${vId || ""}`;
    const val = cache[key];
    return Array.isArray(val) && val.length > 0 ? val : null;
  } catch { return null; }
};

const saveSplitsForItem = (product, vId, splits) => {
  if (typeof window === "undefined") return;
  try {
    const cache = JSON.parse(localStorage.getItem(SPLITS_CACHE_KEY) || "{}");
    const key = `${product}:${vId || ""}`;
    if (!splits || splits.length === 0) {
      delete cache[key];
    } else {
      cache[key] = splits;
    }
    localStorage.setItem(SPLITS_CACHE_KEY, JSON.stringify(cache));
  } catch { }
};

const saveSelectionsCache = (key, customSelections) => {
  if (typeof window === "undefined" || !customSelections) return;
  try {
    const cache = JSON.parse(localStorage.getItem(SELECTIONS_CACHE_KEY) || "{}");
    cache[key] = customSelections;
    localStorage.setItem(SELECTIONS_CACHE_KEY, JSON.stringify(cache));
  } catch { }
};

const loadSelectionsCache = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const cache = JSON.parse(localStorage.getItem(SELECTIONS_CACHE_KEY) || "{}");
    const val = cache[key];
    return val && Object.keys(val).length > 0 ? val : null;
  } catch { return null; }
};

const saveHighlightsCache = (key, productHighlights) => {
  if (typeof window === "undefined" || !productHighlights) return;
  try {
    const cache = JSON.parse(localStorage.getItem(HIGHLIGHTS_CACHE_KEY) || "{}");
    cache[key] = productHighlights;
    localStorage.setItem(HIGHLIGHTS_CACHE_KEY, JSON.stringify(cache));
  } catch { }
};

const loadHighlightsCache = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const cache = JSON.parse(localStorage.getItem(HIGHLIGHTS_CACHE_KEY) || "{}");
    const val = cache[key];
    return val && Array.isArray(val) && val.length > 0 ? val : null;
  } catch { return null; }
};

const getCustomSelections = (details) => {
  if (!details) return null;

  const selections = Object.fromEntries(
    Object.entries(details).filter(
      ([key, value]) =>
        !RESERVED_DETAIL_KEYS.has(key) &&
        value !== null &&
        value !== undefined &&
        String(value).trim() !== "",
    ),
  );

  return Object.keys(selections).length > 0 ? selections : null;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    total: 0,
    discount: 0,
    totalItems: 0,
    beansDiscount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBeansApplied, setIsBeansApplied] = useState(false);
  const [beansBalance, setBeansBalance] = useState(0);
  const [coinConfig, setCoinConfig] = useState({
    pointsEarn: 5,
    pointsToAed: 10,
    maxPointsPerOrder: 0,
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { data: session, status } = useSession();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCouponModal = () => setIsCouponModalOpen(true);
  const closeCouponModal = () => setIsCouponModalOpen(false);

  const toggleBeans = () => setIsBeansApplied(!isBeansApplied);

  const applyCoupon = async (code) => {
    try {
      const res = await axiosClient.get(`/api/surge-coupon/coupons/${code}`);
      const data = res.data;

      const coupon = data.coupon || data.docs?.[0];

      if (coupon && (data.success || !data.message)) {
        const minAmount = Number(coupon.minimumAmount || 0);
        if (minAmount > 0 && cartTotals.subtotal < minAmount) {
          return {
            ok: false,
            message: `Minimum amount of AED ${minAmount} required`,
          };
        }
        let discountVal = 0;
        if (coupon.discountType === "percentage") {
          discountVal =
            cartTotals.subtotal * (Number(coupon.discountAmount) / 100);
        } else {
          discountVal = Number(coupon.discountAmount);
        }
        setAppliedCoupon({
          code: coupon.code,
          discount: discountVal,
          type: coupon.discountType,
          amount: coupon.discountAmount,
        });
        setCartTotals((prev) => ({
          ...prev,
          discount: discountVal,
          total: prev.subtotal - discountVal,
        }));
        return { ok: true, message: "Coupon applied!" };
      }
      return { ok: false, message: data.message || "Invalid coupon code" };
    } catch (e) {
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
      return {
        ok: false,
        message: backendMsg || e.message || "Failed to apply coupon",
      };
    }
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      setCartTotals((prev) => ({
        ...prev,
        discount: 0,
        total: prev.subtotal,
      }));
      setAppliedCoupon(null);
    }
  };

  const fetchLoyaltyData = async () => {
    if (status !== "authenticated") return;
    try {
      const [balanceRes, configRes] = await Promise.all([
        axiosClient.get("/api/user-surge-coins"),
        axiosClient.get("/api/globals/surge-coins"),
      ]);

      if (balanceRes.data.docs?.[0]) {
        setBeansBalance(balanceRes?.data?.docs?.[0]?.totalBalance || 0);
      }

      if (configRes.data) {
        setCoinConfig({
          pointsEarn: configRes.data.pointsEarn || 5,
          pointsToAed: configRes.data.pointsToAed || 10,
          maxPointsPerOrder: configRes.data.maxPointsPerOrder || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, [session, status]);

  useEffect(() => {
    const computedSubtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price?.final_price || item.price || 0);
      return sum + price * (item.quantity || 1);
    }, 0);
    const computedTotalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    setCartTotals((prev) => {
      if (prev.subtotal === computedSubtotal && prev.totalItems === computedTotalItems) return prev;
      return { ...prev, subtotal: computedSubtotal, totalItems: computedTotalItems };
    });
  }, [items]);

  useEffect(() => {
    let coinsDiscount = 0;
    if (isBeansApplied && beansBalance > 0) {
      const maxPossibleDiscount = cartTotals.subtotal * 0.2;
      const balanceInAed = beansBalance / coinConfig.pointsToAed;
      coinsDiscount = Math.min(maxPossibleDiscount, balanceInAed);
    }

    setCartTotals((prev) => ({
      ...prev,
      beansDiscount: coinsDiscount,
      total: Math.max(
        0,
        prev.subtotal -
        (prev.discount || 0) +
        (prev.shipping || 0) +
        (prev.tax || 0) -
        coinsDiscount,
      ),
    }));
  }, [
    isBeansApplied,
    cartTotals.subtotal,
    cartTotals.discount,
    cartTotals.shipping,
    cartTotals.tax,
    beansBalance,
    coinConfig,
  ]);

  useEffect(() => {
    if (status === "loading") return;
    fetchCart();
  }, [session, status]);

  // Sync structural metadata details to localStorage whenever items update dynamically
  useEffect(() => {
    if (items && items.length > 0) {
      const metaStorage = {};
      items.forEach((item) => {
        const key = `${item.product}_${item.vId || ""}`;
        if (item.customSelections || item.tagline || item.productHighlights) {
          metaStorage[key] = {
            customSelections: item.customSelections || null,
            tagline: item.tagline || null,
            productHighlights: item.productHighlights || null,
          };
        }
      });
      if (Object.keys(metaStorage).length > 0) {
        localStorage.setItem("surge_cart_meta", JSON.stringify(metaStorage));
      }
    }
  }, [items]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /** Apply a cart API response (items, subtotal, totalItems) to state */
  const applyCartResponse = (data) => {
    setItems((previousItems) => {
      const expanded = [];

      for (const item of (data.items || [])) {
        const key = `${item.product}:${item.vId || ""}`;
        const splits = loadSplitsForItem(item.product, item.vId);

        if (splits && splits.length > 0) {
          // Expand server item into virtual per-highlights splits
          let remaining = item.quantity;
          splits.forEach((split, i) => {
            const qty = i === splits.length - 1
              ? remaining
              : Math.min(split.quantity, remaining);
            remaining = Math.max(0, remaining - qty);
            if (qty > 0) {
              expanded.push({
                ...item,
                _cartKey: split._cartKey,
                customSelections: split.customSelections || null,
                productHighlights: split.productHighlights || null,
                quantity: qty,
              });
            }
          });
        } else {
          // No splits — restore customSelections from previous state or cache
          const previousItem = previousItems.find(
            (prev) =>
              String(prev.product) === String(item.product) &&
              (prev.vId || null) === (item.vId || null),
          );
          const customSelections =
            (previousItem?.customSelections && Object.keys(previousItem.customSelections).length
              ? previousItem.customSelections
              : null) ||
            loadSelectionsCache(key);

          expanded.push({
            ...item,
            ...(customSelections ? { customSelections } : {}),
          });
        }
      }

      return expanded;
    });
  };

  /** Apply the local guest cart to state */
  const applyGuestCart = () => {
    const cart = getCart();
    setItems(
      (cart.items || []).map((item) => {
        const key = `${item.product}:${item.vId || ""}`;
        const customSelections =
          (item.customSelections && Object.keys(item.customSelections).length
            ? item.customSelections
            : null) ||
          loadSelectionsCache(key);
        const productHighlights =
          (item.productHighlights && item.productHighlights.length
            ? item.productHighlights
            : null) ||
          loadHighlightsCache(key);
        // Ensure every item has a stable _cartKey (backfill items added before this fix)
        const cartKey = item._cartKey || makeCartItemKey(item.product, item.vId, customSelections);
        return {
          ...item,
          _cartKey: cartKey,
          ...(customSelections ? { customSelections } : {}),
          ...(productHighlights ? { productHighlights } : {}),
        };
      }),
    );
    setCartTotals((prev) => ({
      ...prev,
      subtotal: Number(cart.subtotal || 0),
      discount: 0,
      totalItems: Number(cart.totalItems || 0),
    }));
  };

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (session?.user) {
        const res = await axiosClient.get("/api/website/cart");
        applyCartResponse(res.data);
      } else {
        applyGuestCart();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Add ─────────────────────────────────────────────────────────────────────

  const addToCart = async (product, quantity = 1, vId, details = null) => {
    const { productHighlights: _ph, ...restDetails } = details || {};
    // Keep productHighlights as a first-class field on the cart item
    const productHighlights = Array.isArray(_ph) && _ph.length > 0 ? _ph : null;
    const customSelections = getCustomSelections(restDetails);
    if (customSelections) {
      saveSelectionsCache(`${product}:${vId || ""}`, customSelections);
    }
    // Stable key for this specific product+variant+highlights combination
    const cartKey = makeCartItemKey(product, vId || null, customSelections);

    if (session?.user) {
      try {
        const res = await axiosClient.post("/api/website/cart", {
          product,
          quantity,
          vId: vId || null,
        });

        const data = res.data;

        // Maintain virtual splits so applyCartResponse can expand them back
        if (customSelections) {
          const existingSplits = loadSplitsForItem(product, vId) || [];
          const splitIndex = existingSplits.findIndex((s) => s._cartKey === cartKey);
          if (splitIndex >= 0) {
            existingSplits[splitIndex].quantity += quantity;
          } else {
            existingSplits.push({ _cartKey: cartKey, customSelections, productHighlights, quantity });
          }
          saveSplitsForItem(product, vId || null, existingSplits);
        }

        applyCartResponse(data);

        const added = (data.items || []).find(
          (i) =>
            String(i.product) === String(product) &&
            (i.vId || null) === (vId || null),
        );
        if (added || details) {
          addToCartToast({ ...(added || {}), ...(details || {}), customSelections, quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
        const resData = e?.response?.data;
        const backendMsg =
          resData?.message || resData?.error || resData?.errors?.[0]?.message;
        toast.error(backendMsg || e?.message || "Failed to add item to cart");
      }
    } else {
      try {
        await addItemToCart(product, quantity, vId, restDetails);
        const cart = getCart();
        applyGuestCart();
        // Patch productHighlights onto the specific item using its stable cartKey
        if (productHighlights) {
          setItems((currentItems) =>
            currentItems.map((item) =>
              item._cartKey === cartKey
                ? { ...item, productHighlights }
                : item,
            ),
          );
        }
        // Show toast with the item from the refreshed guest cart
        const added = (cart.items || []).find(
          (i) => i._cartKey === cartKey ||
            (String(i.product) === String(product) &&
              (i.vId || null) === (vId || null)),
        );
        if (added || details) {
          addToCartToast({ ...(added || {}), ...(details || {}), quantity }, openCart);
        }
      } catch (e) {
        console.error("Error adding to cart:", e);
        toast.error(e.message || "Failed to add item to cart");
      }
    }
  };

  // ─── Remove ──────────────────────────────────────────────────────────────────

  const removeItem = async (product, vId, cartKey = null) => {
    const key = `${product}_${vId || ""}`;
    try {
      const stored = localStorage.getItem("surge_cart_meta");
      if (stored) {
        const metaStorage = JSON.parse(stored);
        delete metaStorage[key];
        localStorage.setItem("surge_cart_meta", JSON.stringify(metaStorage));
      }
    } catch (err) {
      console.error(err);
    }

    if (session?.user) {
      try {
        const splits = loadSplitsForItem(product, vId);
        if (splits && splits.length > 1 && cartKey) {
          // Other splits remain — remove this one and decrement server qty by 1
          const remaining = splits.filter((s) => s._cartKey !== cartKey);
          saveSplitsForItem(product, vId || null, remaining);
          const res = await axiosClient.patch("/api/website/cart", {
            product,
            vId: vId || null,
            action: "decrement",
          });
          applyCartResponse(res.data);
        } else {
          // Last (or only) split — remove entirely from server
          saveSplitsForItem(product, vId || null, []);
          const res = await axiosClient.delete("/api/website/cart", {
            data: { product, vId: vId || null },
          });
          applyCartResponse(res.data);
        }
      } catch (e) {
        console.error("Error removing from cart:", e);
      }
    } else {
      removeItemFromCart(product, vId, cartKey);
      applyGuestCart();
    }
  };

  // ─── Update Quantity ─────────────────────────────────────────────────────────

  const updateQuantity = async (product, vId, quantity, action, cartKey = null) => {
    if (session?.user) {
      try {
        const splits = loadSplitsForItem(product, vId);
        if (splits && splits.length > 1 && cartKey) {
          // Update only the targeted split and patch server with the new total
          const splitIndex = splits.findIndex((s) => s._cartKey === cartKey);
          if (splitIndex >= 0) {
            const oldQty = splits[splitIndex].quantity;
            let newQty = oldQty;
            if (action === "increment") newQty = oldQty + 1;
            else if (action === "decrement") newQty = Math.max(1, oldQty - 1);
            else if (typeof quantity === "number") newQty = Math.max(1, quantity);

            splits[splitIndex].quantity = newQty;
            saveSplitsForItem(product, vId || null, splits);

            const serverTotal = splits.reduce((sum, s) => sum + s.quantity, 0);
            const res = await axiosClient.patch("/api/website/cart", {
              product,
              vId: vId || null,
              quantity: serverTotal,
            });
            applyCartResponse(res.data);
          }
          return { ok: true };
        }

        const res = await axiosClient.patch("/api/website/cart", {
          product,
          vId: vId || null,
          quantity,
          action,
        });
        applyCartResponse(res.data);
        return { ok: true };
      } catch (e) {
        console.error("Error updating cart quantity:", e);
        const resData = e?.response?.data;
        const backendMsg =
          resData?.message || resData?.error || resData?.errors?.[0]?.message;
        const message = backendMsg || e?.message || "Failed to update quantity";
        return { ok: false, message };
      }
    } else {
      try {
        const cart = getCart();
        const existing = cart.items?.find(
          (i) =>
            cartKey
              ? i._cartKey === cartKey
              : String(i.product) === String(product) &&
                (i.vId || null) === (vId || null),
        );
        if (existing) {
          let newQty = existing.quantity;
          if (action === "increment") newQty = existing.quantity + 1;
          else if (action === "decrement")
            newQty = Math.max(1, existing.quantity - 1);
          else if (typeof quantity === "number") newQty = Math.max(1, quantity);

          updateItemQuantity(product, vId, newQty, cartKey);
        }
        applyGuestCart();
        return { ok: true };
      } catch (e) {
        console.error("Error updating cart quantity:", e);
        return { ok: false, message: e.message || "Failed to update quantity" };
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        openCart,
        closeCart,
        isCartOpen,
        items,
        loading,
        setLoading,
        fetchCart,
        addToCart,
        removeItem,
        updateQuantity,
        cartTotals,
        isCouponModalOpen,
        openCouponModal,
        closeCouponModal,
        isBeansApplied,
        toggleBeans,
        beansBalance,
        coinConfig,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        refreshCart: () => fetchCart(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}