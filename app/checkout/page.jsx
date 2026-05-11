"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import styles from "./page.module.css";
import CheckoutForm from "./_components/CheckoutForm";
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
    city: "", phone: "", emirates: "", saveAddress: false,
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

  // Derived from API emirateCharges keys — updates automatically if backend adds/removes emirates
  const emirateOptions = shippingTax.emirateCharges
    ? Object.keys(shippingTax.emirateCharges).map((key) => ({
      value: key,
      label: key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    }))
    : [
      { value: "dubai", label: "Dubai" },
      { value: "abu_dhabi", label: "Abu Dhabi" },
      { value: "sharjah", label: "Sharjah" },
      { value: "ajman", label: "Ajman" },
      { value: "umm_al_quwain", label: "Umm Al Quwain" },
      { value: "ras_al_khaimah", label: "Ras Al Khaimah" },
      { value: "fujairah", label: "Fujairah" },
    ];

  const [cartTotals, setCartTotals] = useState({
    subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
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

  const effectiveEmirate = useMemo(() => {
    if (delivery !== "ship") return "";
    if (status === "authenticated" && selectedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      return ((addr?.emirates || addr?.state) ?? "dubai").toLowerCase();
    }
    return (shippingForm.emirates || billingForm.emirates || "dubai").toLowerCase();
  }, [delivery, status, selectedAddressId, savedAddresses, shippingForm.emirates, billingForm.emirates]);

  useEffect(() => {
    const sub = product.reduce(
      (acc, item) =>
        acc + parseFloat(item.price?.final_price || item.price || 0) * (item.quantity || 1),
      0,
    );
    const disc = Number(appliedCoupon?.discount || 0);
    const coinsDisc = isBeansApplied ? Number(contextCartTotals.beansDiscount || 0) : 0;

    let currentShipping = 0;
    if (effectiveEmirate) {
      const emirateKey = effectiveEmirate.replace(/\s+/g, "_");
      if (shippingTax.emirateCharges?.[emirateKey] !== undefined) {
        currentShipping = shippingTax.emirateCharges[emirateKey];
      } else {
        const fallbackRates = {
          dubai: 30, abu_dhabi: 50, ajman: 50, fujairah: 50,
          ras_al_khaimah: 50, sharjah: 50, umm_al_quwain: 50,
        };
        currentShipping = fallbackRates[emirateKey] ?? 50;
      }
    }

    const activeTaxPercent = typeof shippingTax.taxPercent === "number" ? shippingTax.taxPercent : 5;
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
  }, [product, shippingTax, effectiveEmirate, appliedCoupon, isBeansApplied, contextCartTotals.beansDiscount]);

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
        emirateOptions={emirateOptions}
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