"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  makeCartItemKey,
  clearCart as clearGuestCart,
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

const normVId = (v) =>
  typeof v === "object" && v !== null ? (v.id || v.value?.id || null) : (v || null);

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

/**
 * Convert customSelections { "Roast Type": "Espresso", "Grind": "Whole Beans" }
 * into the productHighlights array the backend expects:
 * [{ sectionTitle: "Roast Type", items: [{ point: "Espresso" }] }, ...]
 */
const buildHighlightsForServer = (customSelections) => {
  if (!customSelections || Object.keys(customSelections).length === 0) return [];
  return Object.entries(customSelections).map(([sectionTitle, point]) => ({
    sectionTitle,
    items: [{ point: String(point) }],
  }));
};

/**
 * Stable string key for a highlights array — used for client-side duplicate detection.
 * Mirrors what the backend's normalizeHighlights produces (sorted sections + sorted points).
 */
const normalizeHighlightsClient = (highlights) => {
  if (!Array.isArray(highlights) || highlights.length === 0) return "[]";
  const normalized = highlights
    .map((section) => ({
      sectionTitle: section.sectionTitle || "",
      items: (Array.isArray(section.items) ? section.items : [])
        .map((item) => ({ point: typeof item === "string" ? item : (item.point || "") }))
        .filter((item) => item.point)
        .sort((a, b) => a.point.localeCompare(b.point)),
    }))
    .filter((s) => s.sectionTitle || s.items.length > 0)
    .sort((a, b) => a.sectionTitle.localeCompare(b.sectionTitle));
  return JSON.stringify(normalized);
};

const highlightsMatchItem = (a, b) =>
  normalizeHighlightsClient(a || []) === normalizeHighlightsClient(b || []);

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
  const prevStatusRef = useRef(status);

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
          return { ok: false, message: `Minimum amount of AED ${minAmount} required` };
        }
        let discountVal = 0;
        if (coupon.discountType === "percentage") {
          discountVal = cartTotals.subtotal * (Number(coupon.discountAmount) / 100);
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
      const backendMsg = resData?.message || resData?.error || resData?.errors?.[0]?.message;
      return { ok: false, message: backendMsg || e.message || "Failed to apply coupon" };
    }
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      setCartTotals((prev) => ({ ...prev, discount: 0, total: prev.subtotal }));
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
      const cappedBeans = coinConfig.maxPointsPerOrder > 0
        ? Math.min(beansBalance, coinConfig.maxPointsPerOrder)
        : beansBalance;
      const balanceInAed = cappedBeans / coinConfig.pointsToAed;
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

    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    // Use !== "authenticated" so the "loading" → "authenticated" transition (after OAuth
    // redirect) also triggers the merge — not just soft-nav sign-ins.
    if (prevStatus !== "authenticated" && status === "authenticated") {
      const guestCart = getCart();
      if (guestCart.items?.length > 0) {
        mergeGuestCartThenFetch(guestCart.items);
        return;
      }
    }

    fetchCart();
  }, [session, status]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Apply a cart API response to state.
   * The server now owns the full item identity (product + vId + productHighlights),
   * so we set items directly — no client-side split expansion needed.
   */
  const applyCartResponse = (data) => {
    setItems(data.items || []);
  };

  /** Apply the local guest cart to state */
  const applyGuestCart = () => {
    const cart = getCart();
    setItems(
      (cart.items || []).map((item) => {
        const cartKey =
          item._cartKey ||
          makeCartItemKey(item.product, item.vId, item.customSelections || null, item.productHighlights || null);
        return { ...item, _cartKey: cartKey };
      }),
    );
    setCartTotals((prev) => ({
      ...prev,
      subtotal: Number(cart.subtotal || 0),
      discount: 0,
      totalItems: Number(cart.totalItems || 0),
    }));
  };

  // ─── Merge guest cart on login ───────────────────────────────────────────────

  const mergeGuestCartThenFetch = async (guestItems) => {
    for (const item of guestItems) {
      try {
        // Convert the guest item's customSelections to the server-side productHighlights format
        const highlightsForServer = buildHighlightsForServer(item.customSelections);
        await axiosClient.post("/api/website/cart", {
          product: item.product,
          quantity: item.quantity,
          vId: item.vId || null,
          productHighlights: highlightsForServer,
        });
      } catch (err) {
        console.error("Failed to merge guest cart item:", err);
      }
    }
    clearGuestCart();
    await fetchCart();
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
    const customSelections = getCustomSelections(restDetails);

    // Build the highlights payload: use the user's selected values from customSelections.
    // The raw _ph from details is the full product highlights list (all options), not selections.
    const highlightsForServer = buildHighlightsForServer(customSelections);

    // Stable key for this combination (used for guest cart and toast matching)
    const cartKey = makeCartItemKey(product, vId || null, customSelections, highlightsForServer);

    if (session?.user) {
      // Client-side cap check: look for a matching item already in state
      const existingItem = items.find(
        (i) =>
          String(i.product) === String(product) &&
          normVId(i.vId) === (vId || null) &&
          highlightsMatchItem(i.productHighlights, highlightsForServer),
      );
      if (existingItem && existingItem.quantity + quantity > 10) {
        toast.error("Maximum quantity of 10 per item reached");
        return;
      }

      try {
        const res = await axiosClient.post("/api/website/cart", {
          product,
          quantity,
          vId: vId || null,
          productHighlights: highlightsForServer,
        });

        const data = res.data;
        applyCartResponse(data);

        const added = (data.items || []).find(
          (i) =>
            String(i.product) === String(product) &&
            normVId(i.vId) === (vId || null) &&
            highlightsMatchItem(i.productHighlights, highlightsForServer),
        );
        if (added || details) {
          addToCartToast(
            { ...(added || {}), ...(details || {}), customSelections, quantity },
            openCart,
          );
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
        // Pass the selected highlights (same format as server returns for authenticated users)
        // so guest items and authenticated items are consistent. CheckoutForm can then do a
        // direct p.productHighlights pass-through for both cases without re-filtering.
        await addItemToCart(product, quantity, vId, restDetails, highlightsForServer.length > 0 ? highlightsForServer : null);
        const cart = getCart();
        applyGuestCart();
        const added = (cart.items || []).find(
          (i) =>
            i._cartKey === cartKey ||
            (String(i.product) === String(product) && (i.vId || null) === (vId || null)),
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

  /**
   * @param {string} product
   * @param {string|null} vId
   * @param {Array} productHighlights  — for authenticated: the highlights array from the cart item
   * @param {string|null} cartKey      — for guest: the _cartKey from the guest cart item
   */
  const removeItem = async (product, vId, productHighlights = [], cartKey = null) => {
    if (session?.user) {
      try {
        const res = await axiosClient.delete("/api/website/cart", {
          data: { product, vId: vId || null, productHighlights },
        });
        applyCartResponse(res.data);
      } catch (e) {
        console.error("Error removing from cart:", e);
      }
    } else {
      removeItemFromCart(product, vId, cartKey);
      applyGuestCart();
    }
  };

  // ─── Update Quantity ─────────────────────────────────────────────────────────

  /**
   * @param {string} product
   * @param {string|null} vId
   * @param {number|null} quantity
   * @param {string} action          — 'increment' | 'decrement' | null
   * @param {Array} productHighlights — for authenticated: highlights array from the cart item
   * @param {string|null} cartKey     — for guest: the _cartKey from the guest cart item
   */
  const updateQuantity = async (
    product,
    vId,
    quantity,
    action,
    productHighlights = [],
    cartKey = null,
  ) => {
    if (session?.user) {
      try {
        const res = await axiosClient.patch("/api/website/cart", {
          product,
          vId: vId || null,
          ...(quantity != null ? { quantity } : {}),
          action,
          productHighlights,
        });
        applyCartResponse(res.data);
        return { ok: true };
      } catch (e) {
        console.error("Error updating cart quantity:", e);
        const resData = e?.response?.data;
        const backendMsg =
          resData?.message || resData?.error || resData?.errors?.[0]?.message;
        const message = backendMsg || e?.message || "Failed to update quantity";
        if (e?.response?.status === 400) fetchCart();
        return { ok: false, message };
      }
    } else {
      try {
        const cart = getCart();
        const existing = cart.items?.find((i) =>
          cartKey && i._cartKey ? i._cartKey === cartKey : String(i.product) === String(product) && (i.vId || null) === (vId || null),
        );
        if (existing) {
          let newQty = existing.quantity;
          if (action === "increment") newQty = existing.quantity + 1;
          else if (action === "decrement") newQty = Math.max(1, existing.quantity - 1);
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

  const clearCart = async () => {
    if (session?.user) {
      await fetchCart();
    } else {
      clearGuestCart();
      setItems([]);
      setCartTotals((prev) => ({ ...prev, subtotal: 0, totalItems: 0, discount: 0 }));
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
        clearCart,
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
