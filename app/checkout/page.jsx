"use client";
import React, { useState, useEffect, Suspense } from "react";
import styles from "./page.module.css";
import CheckoutForm from "./_components/CheckoutForm";
// import OrderSuccess from "./success/page";

// TODO: replace with Surge mock placeholder image — drop a `1.png` next to this file or update path
const placeholderImage = "/1.png";

import { useSession } from "next-auth/react";
import { useCart } from "@/app/_context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axiosClient from "@/lib/axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutContent() {
  const { data: session, status } = useSession();
  const {
    cartTotals: contextCartTotals,
    items: cartProducts,
    isBeansApplied,
    appliedCoupon,
    beansBalance,
    coinConfig,
  } = useCart();

  // Hardcoded for now — wire to URL params later
  const subscriptionId = null;
  const variationId = null;

  const [isLoading, setIsLoading] = useState(true);
  const [checkoutMode, setCheckoutMode] = useState("cart");
  const [product, setProducts] = useState([]);

  useEffect(() => {
    if (cartProducts && cartProducts.length > 0) {
      setProducts(cartProducts);
    }
  }, [cartProducts]);

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

  const [shippingTax, setShippingTax] = useState({
    shipping: 0,
    tax: 0,
    taxPercent: 5,
    emirateCharges: null
  });
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0,
  });

  // ── Initial Data Fetch ──
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch saved addresses (authenticated only)
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await axiosClient.get(`/api/users/${session.user.id}/addresses`);
          const data = res.data;
          const addresses = data.addresses || [];
          setSavedAddresses(addresses);

          if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.isDefaultAddress || a.isDefault);
            setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
          }
        } catch (err) {
          console.error("Failed to fetch addresses", err);
        }
      } else if (status === "unauthenticated") {
        setSavedAddresses([]);
        setSelectedAddressId(null);
      }

      // 2. Fetch shipping + tax rates
      try {
        const res = await axiosClient.get(`/api/globals/ship-and-tax`);
        const data = res.data;
        if (data) {
          setShippingTax({
            shipping: data.shipping ?? 0,
            tax: 0,
            taxPercent: data.tax ?? 5,
            emirateCharges: data.emirateCharges || null
          });
        }
      } catch (err) {
        console.error("Failed to fetch shipping/tax", err);
      }

      setIsLoading(false);
    };

    if (status !== "loading") {
      fetchData();
    }
  }, [status, session]);

  // Recalculate totals whenever delivery/products/emirate change
  useEffect(() => {
    const sub = product.reduce(
      (acc, item) =>
        acc + parseFloat(item.price?.final_price || item.price || 0) * (item.quantity || 1),
      0,
    );
    const disc = Number(appliedCoupon?.discountAmount || 0);
    const coinsDisc = isBeansApplied ? Number(contextCartTotals.beansDiscount || 0) : 0;

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

      // 1. Calculate shipping
      const emirateKey = currentEmirate.toLowerCase().replace(/\s+/g, "_");
      if (shippingTax.emirateCharges && shippingTax.emirateCharges[emirateKey] !== undefined) {
        currentShipping = shippingTax.emirateCharges[emirateKey];
      } else {
        // Fallback to a sensible default only if backend data is truly missing
        const fallbackRates = {
          dubai: 30, abu_dhabi: 50, ajman: 50, fujairah: 50,
          ras_al_khaimah: 50, sharjah: 50, umm_al_quwain: 50,
        };
        currentShipping = fallbackRates[emirateKey] ?? 50;
      }
    }

    const activeTaxPercent = typeof shippingTax.taxPercent === 'number' ? shippingTax.taxPercent : 5;
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

  const elementsOptions = {
    paymentMethodCreation: "manual",
    mode: "payment",
    amount: Math.max(1, Math.round(cartTotals.total * 100)), // Stripe expects cents, min 1
    currency: "aed",
    ...(status === "authenticated" && { setup_future_usage: "off_session" }),
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#C4754E',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions} key={`${session?.user?.id || "guest"}-${checkoutMode}`}>
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
    </Elements>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}