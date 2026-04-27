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
import ExpressCheckoutSection from "./ExpressCheckoutSection";
import OrderSuccess from "../success/page";


import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/app/_context/CartContext";
import axiosClient from "@/lib/axios";
import { toast } from "react-hot-toast";
import { validateCheckoutForm } from "@/utils/validatorFunctions";
import {
  formatCheckoutAddress,
  buildOneTimePayload,
  buildSuccessUrl,
  scrollToFirstError,
} from "@/utils/checkoutUtils";
import { saveAddressAPI } from "@/app/account/profile/_components/ProfileComponents/profileApiUtils";

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
  orderComplete,
  setOrderComplete,
  orderData,
  setOrderData,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { isBeansApplied, appliedCoupon } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isExpressAvailable, setIsExpressAvailable] = useState(false);

  const [email, setEmail] = useState(session?.user?.email || "");
  const [emailUserTyped, setEmailUserTyped] = useState(false);
  useEffect(() => {
    if (session?.user?.email && !emailUserTyped) setEmail(session.user.email);
  }, [session?.user?.email, emailUserTyped]);

  const clearError = (key) =>
    setValidationErrors((prev) => ({ ...prev, [key]: "" }));

  // ── Payment Handler ──
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    // 1. Validate fields
    const { isValid, errors } = validateCheckoutForm({
      email,
      delivery,
      status,
      selectedAddressId,
      shippingForm,
      billingForm,
      useShippingAsBilling,
    });

    if (!isValid) {
      setValidationErrors(errors);
      setTimeout(() => scrollToFirstError(errors, styles.InputError), 100);
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Trigger Stripe validation
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
        setIsProcessing(false);
        return;
      }

      // 3. Build backend payload
      const shipAddr = delivery === "ship"
        ? formatCheckoutAddress(
            status === "authenticated" && selectedAddressId
              ? savedAddresses.find((a) => a.id === selectedAddressId)
              : shippingForm
          )
        : null;

      const billAddr = (useShippingAsBilling && delivery === "ship")
        ? { ...shipAddr }
        : formatCheckoutAddress(billingForm);

      const payload = buildOneTimePayload({
        delivery: delivery === "ship" ? "delivery" : "pickup",
        shippingAddress: shipAddr,
        billingAddress: billAddr,
        shippingAddressAsBillingAddress: useShippingAsBilling,
        email: email,
        products: product.map((p) => ({
          productId: p.id,
          variantId: p.vId || "",
          quantity: p.quantity,
        })),
        useWTCoins: !!isBeansApplied,
        appliedCouponCode: appliedCoupon?.code || "",
      });

      // 4. Call backend to create order and get client secret
      const res = await axiosClient.post("/api/checkout/one-time", payload);
      const data = res.data;

      if (!data.success) throw new Error(data.error || "Checkout failed");

      // 5. Save address if opted in
      if (shippingForm.saveAddress && status === "authenticated" && session?.user?.id && delivery === "ship") {
        try {
          await saveAddressAPI(session.user.id, {
            label: "Home",
            addressFirstName: shippingForm.firstName.trim(),
            addressLastName: shippingForm.lastName.trim(),
            street: shippingForm.address.trim(),
            apartment: (shippingForm.apartment || "").trim(),
            country: "United Arab Emirates",
            city: shippingForm.city.trim(),
            emirates: shippingForm.emirates || "dubai",
            phoneNumber: shippingForm.phone.trim(),
            isDefaultAddress: false,
          });
        } catch (saveErr) {
          console.error("Failed to auto-save address", saveErr);
        }
      }

      // 6. Confirm payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}${buildSuccessUrl("cart", data)}`,
        },
      });

      if (confirmError) {
        toast.error(confirmError.message || "Payment confirmation failed");
        setIsProcessing(false);
      }
      // If success, Stripe redirects automatically to return_url

    } catch (e) {
      console.error(e);
      const resData = e?.response?.data;
      const backendMsg = resData?.message || resData?.error || resData?.errors?.[0]?.message;
      toast.error(backendMsg || e.message || "An error occurred");
      setIsProcessing(false);
    }
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
              <div className={styles.One} style={{ display: isExpressAvailable ? "flex" : "none" }}>
                <p style={{ fontWeight: "400" }}>EXPRESS CHECKOUT</p>
                <div className={styles.ExpressContainer}>
                  <ExpressCheckoutSection onAvailabilityChange={setIsExpressAvailable} />
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
          isAddressSelected={delivery === "pickup" || (status === "authenticated" ? !!selectedAddressId : !!shippingForm.emirates)}
        />
      </div>
    </div>
  );
}