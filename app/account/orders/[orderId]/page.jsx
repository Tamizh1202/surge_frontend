'use client';
import axiosClient from "@/lib/axios";
import styles from "../page.module.css";
import ProductDetail from "./_components/ProductDetail/ProductDetails";
import DelivereyDetails from "./_components/delivery-details/page";
import OrderDetails from "./_components/order-details/page";
import Invoice from "./_components/invoice/page";
import React, { useEffect, useState } from "react";

// 1. Properly structured Mock Data to prevent "taxPercentage" undefined error
const MOCK_ORDER_DETAIL = {
  id: "2864297643",
  invoiceId: "#2864297643",
  deliveryStatus: "cancelled", // Change this to "placed" to test different UI states
  createdAt: "Dec 10, 2025",
  deliveredAt: "Dec 14, 2025",
  deliveringBy: "Dec 27, 2025",
  payment_method_title: "Visa 64xxxxxxxx",
  // Components expect financial data inside this 'financials' object
  financials: {
    subtotal: 1470,
    couponDiscount: 80,
    wtCoinsDiscount: 0, 
    shippingCharge: 50,
    taxPercentage: 5,   // FIXED: This property is now defined
    taxAmount: 73.5,
    total: 1520
  },
  customer: {
    name: "Ahmed Al-Mansouri",
    address: "Office 1502, Jumeirah Business Centre 1, JLT, Dubai",
    phone: "+971 50 123 4567"
  },
  items: Array(3).fill({ 
    product: { name: "Indonesia Meriah Anaerobic Natural", weight: "1kg" }, 
    quantity: 1 
  })
};

export default function OrderDetailPage({ params }) {
  const { orderId } = React.use(params);
  
  
  const [order, setOrder] = useState(MOCK_ORDER_DETAIL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/web-orders/${orderId}?depth=2`);
        const data = response.data;

        if (data) {
          setOrder(data);
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if it is a real ID and not the mock one
    if (orderId && orderId !== "2864297643") {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.error}>Order not found.</div>;

  return (

    <div className={styles.main}>

      <div className={styles.container}>

        <ProductDetail order={order} />

        <DelivereyDetails order={order} />

        <OrderDetails order={order} />

        <Invoice order={order} />

      </div>

    </div>

  );
}