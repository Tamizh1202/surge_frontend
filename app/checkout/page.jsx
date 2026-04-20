"use client";
import React, { useState, useEffect, Suspense } from "react";
import styles from "./page.module.css";
import CheckoutForm from "./_components/CheckoutForm";
// import OrderSuccess from "./success/page";

// TODO: replace with Surge mock placeholder image — drop a `1.png` next to this file or update path
const placeholderImage = "/1.png";

// TODO: replace with Surge's real session
const useSession = () => ({ data: null, status: "unauthenticated" });

// TODO: replace with Surge's real cart context
const useCart = () => ({
  cartTotals: null,
  items: [],
  isBeansApplied: false,
  beansBalance: 0,
  coinConfig: { pointsToAed: 10, pointsEarn: 1 },
});

// ── Mock product so the checkout renders without any backend ──────────────
const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    vId: "",
    image: placeholderImage,
    name: "Sample Product",
    variantName: "",
    weight: "250gm",
    frequency: "",
    price: 75,
    quantity: 1,
  },
  {
    id: "mock-2",
    vId: "",
    image: placeholderImage,
    name: "Another Product",
    variantName: "",
    weight: "500gm",
    frequency: "",
    price: 120,
    quantity: 2,
  },
];

function CheckoutContent() {
  const { data: session, status } = useSession();
  const {
    cartTotals: contextCartTotals,
    items: cartProducts,
    isBeansApplied,
    beansBalance,
    coinConfig,
  } = useCart();

  // Hardcoded for now — wire to URL params later
  const subscriptionId = null;
  const variationId = null;

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState("cart");
  const [product, setProducts] = useState(MOCK_PRODUCTS);

  const [delivery, setDelivery] = useState("ship");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);

  // ── Order completion state ──
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    firstName: "", lastName: "", address: "", apartment: "",
    city: "", phone: "", emirates: "dubai", saveAddress: false,
  });
  const [billingForm, setBillingForm] = useState({
    firstName: "", lastName: "", address: "", apartment: "",
    city: "", phone: "", emirates: "dubai",
  });

  const [shippingTax] = useState({ shipping: 0, tax: 0, taxPercent: 5 });
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0,
  });

  // Recalculate totals whenever delivery/products/emirate change
  useEffect(() => {
    const sub = product.reduce(
      (acc, item) =>
        acc + parseFloat(item.price?.final_price || item.price || 0) * (item.quantity || 1),
      0,
    );
    const disc = 0;
    const coinsDisc = 0;

    let currentShipping = 0;
    if (delivery === "ship") {
      let currentEmirate = "dubai";
      if (status === "authenticated" && selectedAddressId) {
        const selectedAddr = savedAddresses.find((a) => a.id === selectedAddressId);
        if (selectedAddr) {
          currentEmirate = (selectedAddr.emirates || selectedAddr.state || "dubai").toLowerCase();
        }
      } else {
        currentEmirate = (shippingForm.emirates || "dubai").toLowerCase();
      }

      const rates = {
        dubai: 30, abu_dhabi: 50, ajman: 50, fujairah: 50,
        ras_al_khaimah: 50, sharjah: 50, umm_al_quwain: 50,
      };
      currentShipping = rates[currentEmirate] || 50;
    }

    const activeTaxPercent = shippingTax.taxPercent > 0 ? shippingTax.taxPercent : 5;
    const taxableAmount = Math.max(0, sub - disc - coinsDisc + currentShipping);
    const taxValue = taxableAmount * (activeTaxPercent / 100);

    setCartTotals({
      subtotal: sub,
      discount: disc,
      beansDiscount: coinsDisc,
      shipping: currentShipping,
      tax: taxValue,
      taxPercent: activeTaxPercent,
      total: Math.max(0, sub - disc - coinsDisc + currentShipping + taxValue),
    });
  }, [product, shippingTax, delivery, selectedAddressId, savedAddresses, shippingForm.emirates, status]);

  if (isLoading || status === "loading") {
    return (
      <div className={styles.MainM}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutForm
      session={session}
      status={status}
      delivery={delivery}
      setDelivery={setDelivery}
      savedAddresses={savedAddresses}
      setSavedAddresses={setSavedAddresses}
      selectedAddressId={selectedAddressId}
      setSelectedAddressId={setSelectedAddressId}
      openMenuId={openMenuId}
      setOpenMenuId={setOpenMenuId}
      useShippingAsBilling={useShippingAsBilling}
      setUseShippingAsBilling={setUseShippingAsBilling}
      product={product}
      cartTotals={cartTotals}
      shippingForm={shippingForm}
      setShippingForm={setShippingForm}
      setBillingForm={setBillingForm}
      checkoutMode={checkoutMode}
      billingForm={billingForm}
      subscriptionId={subscriptionId}
      variationId={variationId}
      orderComplete={orderComplete}
      setOrderComplete={setOrderComplete}
      orderData={orderData}
      setOrderData={setOrderData}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}