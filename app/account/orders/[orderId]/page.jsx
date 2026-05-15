'use client';
import axiosClient from "@/lib/axios";
import styles from "../page.module.css";
import ProductDetail from "./_components/ProductDetail/ProductDetails";
import DelivereyDetails from "./_components/delivery-details/page";
import OrderDetails from "./_components/order-details/page";
import Invoice from "./_components/invoice/page";
import React, { useEffect, useState } from "react";

export default function OrderDetailPage({ params }) {
  const { orderId } = React.use(params);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
     
        const response = await axiosClient.get(`/api/web-orders/${orderId}?depth=2`);
        let data = response.data;

        if (data) {
    
          const cancelledList = JSON.parse(localStorage.getItem("cancelled_orders_cache") || "[]");
          
          if (cancelledList.includes(orderId)) {
            data = {
              ...data,
              deliveryStatus: 'cancelled',
          
              cancelReason: data.cancelReason || "User cancelled",
              cancelledOn: data.cancelledOn || new Date().toISOString()
            };
          }
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
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