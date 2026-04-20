"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

import ContactSection from "./ContactSection";
import DeliverySelector from "./DeliverySelector";
import ShippingAddressSection from "./ShippingAddressSection";
import BillingAddressSection from "./BillingAddressSection";
import { PaymentCardSection, PaymentButtonSection } from "./PaymentSection";
import OrderSummary from "./OrderSummary";


// TODO: replace with Surge's actual cart context
const useCart = () => ({ openCart: () => { }, isBeansApplied: false, appliedCoupon: null });

// TODO: replace with Surge's actual toast
const toast = { error: (msg) => console.error(msg), success: (msg) => console.log(msg) };

// TODO: replace with Surge's actual validator
const validateCheckoutForm = () => ({ isValid: true, errors: {} });

// TODO: replace with Surge's actual checkout utils
const scrollToFirstError = () => { };
const formatCheckoutAddress = (a = {}) => ({
  addressFirstName: a.firstName || "",
  addressLastName: a.lastName || "",
  addressLine1: a.address || "",
  addressLine2: a.apartment || "",
  city: a.city || "",
  emirates: a.emirates || "dubai",
  phoneNumber: a.phone || "",
  addressCountry: "United Arab Emirates",
});

// TODO: dummy ExpressCheckoutElement — replace when wiring Stripe
const ExpressCheckoutElement = () => (
  <div style={{ padding: "12px", border: "1px dashed #ccc", borderRadius: "6px", textAlign: "center", color: "#888" }}>
    Express Checkout (Stripe placeholder)
  </div>
);

export default function CheckoutForm({
  session,
  status,
  delivery,
  setDelivery,
  savedAddresses,
  setSavedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  openMenuId,
  setOpenMenuId,
  useShippingAsBilling,
  setUseShippingAsBilling,
  product,
  cartTotals,
  shippingForm,
  setShippingForm,
  billingForm,
  setBillingForm,
  checkoutMode,
  subscriptionId,
  variationId,
  // ── New props for order completion ──
  // These control whether we show the success view or the checkout form on the LHS
  orderComplete,
  setOrderComplete,
  orderData,
  setOrderData,
}) {
  const { isBeansApplied, appliedCoupon } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [email, setEmail] = useState(session?.user?.email || "");
  const [emailUserTyped, setEmailUserTyped] = useState(false);
  useEffect(() => {
    if (session?.user?.email && !emailUserTyped) setEmail(session.user.email);
  }, [session?.user?.email, emailUserTyped]);

  const clearError = (key) =>
    setValidationErrors((prev) => ({ ...prev, [key]: "" }));

  // TODO: wire real Stripe + backend payment flow
  const handlePayment = async () => {
    const { isValid, errors } = validateCheckoutForm({
      email, delivery, status, selectedAddressId,
      shippingForm, billingForm, useShippingAsBilling,
    });
    if (!isValid) {
      setValidationErrors(errors);
      setTimeout(() => scrollToFirstError(errors, styles.InputError), 100);
      return;
    }
    setIsProcessing(true);
    console.log("Dummy payment submitted", { email, delivery, shippingForm, billingForm });
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Dummy checkout complete");

      // ── After successful payment, flip to the success view ──
      // Build the order object from what we already have, then toggle the flag.
      // The LHS will now render <OrderSuccess> instead of the form fields,
      // while the RHS OrderSummary stays visible since it's outside the conditional.
      setOrderData({
        id: "2864297643", // replace with real order id from API response
        paymentMethod: { brand: "Visa", last4: "6494" },
        billingAddress: {
          line1: billingForm.address || shippingForm.address,
          line2: billingForm.apartment || shippingForm.apartment,
          city: billingForm.city || shippingForm.city,
          zip: "450123",
        },
        shippingAddress: {
          line1: shippingForm.address,
          line2: shippingForm.apartment,
          city: shippingForm.city,
          zip: "450123",
        },
        contactEmail: email,
      });
      setOrderComplete(true);
    }, 800);
  };

  return (
    <div className={styles.Main} onClick={() => setOpenMenuId(null)}>
      <div className={styles.MainConatiner}>
        <div className={styles.Left}>

          {/*
            ── Conditional LHS rendering ──
            When orderComplete is true, we swap out ALL the checkout form sections
            (express checkout, contact, delivery, shipping, payment, billing)
            with the OrderSuccess component. Because it's inside the same
            styles.Left container, it inherits the exact same width, padding,
            and grid positioning — no extra layout CSS needed.
          */}
          {orderComplete ? (
            <OrderSuccess order={orderData} />
          ) : (
            <>
              <div className={styles.One}>
                <p style={{ fontWeight: "400" }}>EXPRESS CHECKOUT</p>
                <div className={styles.ExpressContainer}>
                  <ExpressCheckoutElement />
                </div>
              </div>

              <ContactSection
                email={email}
                setEmail={setEmail}
                setEmailUserTyped={setEmailUserTyped}
                status={status}
                session={session}
                validationErrors={validationErrors}
                clearError={clearError}
                setValidationErrors={setValidationErrors}
              />

              <DeliverySelector delivery={delivery} setDelivery={setDelivery} />

              <ShippingAddressSection
                delivery={delivery}
                status={status}
                savedAddresses={savedAddresses}
                setSavedAddresses={setSavedAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                shippingForm={shippingForm}
                setShippingForm={setShippingForm}
                validationErrors={validationErrors}
                clearError={clearError}
                setValidationErrors={setValidationErrors}
                session={session}
              />

              <PaymentCardSection validationErrors={validationErrors} />

              <BillingAddressSection
                delivery={delivery}
                useShippingAsBilling={useShippingAsBilling}
                setUseShippingAsBilling={setUseShippingAsBilling}
                billingForm={billingForm}
                setBillingForm={setBillingForm}
                validationErrors={validationErrors}
                clearError={clearError}
                setValidationErrors={setValidationErrors}
              />

              <PaymentButtonSection
                isProcessing={isProcessing}
                handlePayment={handlePayment}
              />
            </>
          )}
        </div>

        <div className={styles.Line}></div>

        {/* ── RHS: OrderSummary always renders, regardless of orderComplete ── */}
        <OrderSummary
          product={product}
          cartTotals={cartTotals}
          delivery={delivery}
          checkoutMode={checkoutMode}
          isProcessing={isProcessing}
          handlePayment={handlePayment}
        />
      </div>
    </div>
  );
}