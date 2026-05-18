// Fetch product and variant info from Payload CMS

import axiosClient from "@/lib/axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://surge-backend-seven.vercel.app";

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

// Stable key encoding product + variant + selections — two items are the same only if all three match
export const makeCartItemKey = (product, vId, customSelections) => {
  const selKey =
    customSelections && Object.keys(customSelections).length > 0
      ? JSON.stringify(Object.fromEntries(Object.entries(customSelections).sort()))
      : "";
  return `${product}__${vId || ""}__${selKey}`;
};

async function fetchCartProduct(productId, vid = null) {
  const res = await axiosClient.get(`/api/web-products/${productId}?depth=1`);
  const productDoc = await res.data;

  console.log(productDoc);

  if (!productDoc || productDoc.errors) return null;

  // If vid is provided, pick the matching variant
  if (vid) {
    const variant = productDoc.variants?.find((v) => v.id === vid);
    if (variant) {
      return {
        product: productDoc.id,
        name: `${productDoc.name}`,
        price: variant.variantSalePrice || variant.variantRegularPrice,
        image: variant.variantImage?.url || productDoc.productImage?.url || "",
        vId: vid,
        tagline: productDoc.tagline,
        variantName: variant.variantName,
        inStock: variant.variantInStock,
        stockQuantity: variant.variantStockQuantity,
      };
    }
  }

  // No vid — simple product
  return {
    product: productDoc.id,
    name: productDoc.name,
    price: productDoc.salePrice || productDoc.regularPrice,
    image: productDoc.productImage?.url || "",
    vId: null,
    tagline: productDoc.tagline,
    inStock: productDoc.inStock,
    stockQuantity: productDoc.stockQuantity,
  };
}

// Read the full cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem("guestCart");
    console.log(cart);
    if (cart) {
      return JSON.parse(cart);
    }
  } catch (e) {
    console.error("Error reading guestCart:", e);
  }
  return { items: [], subtotal: 0, totalItems: 0 };
};

// Persist the cart to localStorage
const saveCart = (cart) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

// Recalculate subtotal and totalItems from items array
const recalculate = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
};

// Add an item to the guest cart (fetches product details from Payload)
export const addItemToCart = async (productId, quantity = 1, vid = null, details = null) => {
  const cart = getCart();
  const items = cart.items || [];
  const customSelections = getCustomSelections(details);

  // Fetch latest product/variant data from Payload
  const productData = await fetchCartProduct(productId, vid || null);
  if (!productData) {
    console.error("Could not fetch product data for guest cart");
    return;
  }

  const cartKey = makeCartItemKey(productData.product, productData.vId, customSelections);

  // Two items are the same only when product + variant + highlights all match
  const existingIndex = items.findIndex((item) =>
    item._cartKey
      ? item._cartKey === cartKey
      : item.product === productData.product &&
        item.vId === productData.vId &&
        JSON.stringify(item.customSelections || {}) === JSON.stringify(customSelections || {}),
  );

  if (existingIndex >= 0) {
    const newQty = items[existingIndex].quantity + quantity;

    // Validate stock
    if (productData.inStock === false) {
      throw new Error("This product is out of stock");
    }
    if (
      productData.stockQuantity !== null &&
      productData.stockQuantity !== undefined &&
      newQty > productData.stockQuantity
    ) {
      throw new Error(`Only ${productData.stockQuantity} units available`);
    }

    items[existingIndex] = {
      ...items[existingIndex],
      quantity: newQty,
      ...(customSelections ? { customSelections } : {}),
    };
  } else {
    // Validate stock for new item
    if (productData.inStock === false) {
      throw new Error("This product is out of stock");
    }
    if (
      productData.stockQuantity !== null &&
      productData.stockQuantity !== undefined &&
      quantity > productData.stockQuantity
    ) {
      throw new Error(`Only ${productData.stockQuantity} units available`);
    }

    items.push({
      ...productData,
      _cartKey: cartKey,
      quantity,
      ...(customSelections ? { customSelections } : {}),
    });
  }

  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Remove an item from the guest cart by cartKey (preferred) or product + variant ID
export const removeItemFromCart = (productId, vid = null, cartKey = null) => {
  const cart = getCart();
  const items = (cart.items || []).filter((item) => {
    if (cartKey) return item._cartKey !== cartKey;
    return !(item.product === productId && item.vId === vid);
  });
  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Update quantity of a specific item
export const updateItemQuantity = (productId, vid = null, quantity, cartKey = null) => {
  const cart = getCart();
  const items = (cart.items || []).map((item) => {
    const matches = cartKey
      ? item._cartKey === cartKey
      : item.product === productId && item.vId === vid;
    if (matches) {
      const newQty = Math.max(1, quantity);

      // Validate stock
      if (item.inStock === false) {
        throw new Error("This product is out of stock");
      }
      if (
        item.stockQuantity !== null &&
        item.stockQuantity !== undefined &&
        newQty > item.stockQuantity
      ) {
        throw new Error(`Only ${item.stockQuantity} units available`);
      }

      return { ...item, quantity: newQty };
    }
    return item;
  });
  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Decrease quantity of a specific item by 1; removes the item if quantity reaches 0
export const decrementItem = (productId, vid = null, cartKey = null) => {
  const cart = getCart();
  let items = (cart.items || [])
    .map((item) => {
      const matches = cartKey
        ? item._cartKey === cartKey
        : item.product === productId && item.vId === vid;
      if (matches) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  const { subtotal, totalItems } = recalculate(items);
  saveCart({ items, subtotal, totalItems });
};

// Clear the entire guest cart
export const clearCart = () => {
  saveCart({ items: [], subtotal: 0, totalItems: 0 });
};
