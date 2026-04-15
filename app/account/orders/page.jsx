"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import orderZero from "./orderZero.png";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import OrderCard from "./_components/OrderCard/OrderCard";
import CancelOrderPopup from "./_components/CancelOrderPopup/CancelOrderPopup";
import FilterOrdersPopup from "./_components/FilterPopup/FilterOrdersPopup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- JSON MOCK DATA ---
const MOCK_ORDERS = [
  {
    id: "2864297643",
    invoiceId: "#2864297643",
    orderTotal: 250,
    deliveryStatus: "placed", // UI shows 'Order Placed'
    createdAt: "2025-12-17T10:42:00Z",
    deliveringBy: "Dec 28, 2025",
    items: [
      { product: { name: "Indonesia Meriah Anaerobic Natural", weight: "1kg" } },
      { product: { name: "Indonesia Meriah Anaerobic Natural", weight: "1kg" } },
      { product: { name: "Brazil Santos Dark Roast", weight: "500g" } },
    ]
  },
  {
    id: "2864297644",
    invoiceId: "#2864297644",
    orderTotal: 120,
    deliveryStatus: "delivered", // UI shows 'Delivered'
    createdAt: "2025-12-10T08:30:00Z",
    deliveredOn: "Dec 15, 2025",
    items: [
      { product: { name: "Ethiopia Yirgacheffe", weight: "1kg" } }
    ]
  }
];

// TOGGLE THIS: use MOCK_ORDERS to see list, [] to see Empty State
const INITIAL_DATA = MOCK_ORDERS; 

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false); // Set to false to see JSON data immediately
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ status: "All", time: "" });

  // Mock fetch logic
  const fetchOrders = async (pageNumber = 1) => {
    // When using JSON data, we just simulate a delay
    if (pageNumber === 1) setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Logic: If searching for something not in mock, show empty
      if (searchQuery && !MOCK_ORDERS.some(o => o.invoiceId.includes(searchQuery))) {
        setOrders([]);
      } else {
        setOrders(INITIAL_DATA);
      }
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchOrders(1);
  }, [debouncedSearch, filters]);

  const handleLoadMore = () => {
    if (!fetchingMore && hasNextPage) fetchOrders(page + 1);
  };

  const handleCancelButton = (orderId) => {
    setSelectedOrderId(orderId);
    setIsCancelPopupOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    toast.success(`Mock: Order ${selectedOrderId} cancelled for ${reason}`);
    setIsCancelPopupOpen(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.Top}>
          <div className={styles.Left}>
            <h1>All Orders</h1>
          </div>
          <div className={styles.Right}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search in Orders"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.Filter} onClick={() => setIsFilterPopupOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M6.65149 15C6.40016 15 6.18991 14.9153 6.02074 14.746C5.85141 14.5768 5.76674 14.3666 5.76674 14.1152V8.327L0.168743 1.2155C-0.0235907 0.959 -0.0515075 0.692333 0.0849925 0.4155C0.221659 0.1385 0.452159 0 0.776493 0H13.757C14.0813 0 14.3118 0.1385 14.4485 0.4155C14.585 0.692333 14.5571 0.959 14.3647 1.2155L8.76674 8.327V14.1152C8.76674 14.3666 8.68208 14.5768 8.51274 14.746C8.34358 14.9153 8.13333 15 7.88199 15H6.65149ZM7.26674 7.8L12.2167 1.5H2.31674L7.26674 7.8Z"
                  fill={filters.status !== "All" ? "#2F362A" : "#6E736A"}
                />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading orders...</p>
        ) : orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} handleCancelButton={handleCancelButton} />
            ))}
          </div>
        ) : (
          <div className={styles.EmptyOrdersState}>
            <Image src={orderZero} alt="No orders" width={140} height={160} />
            {searchQuery || (filters.status && filters.status !== "All") ? (
              <>
                <h4>No orders found</h4>
                <p>Try adjusting your search or filters.</p>
                <button className={styles.ShopNowBtn} onClick={() => { setSearchQuery(""); setFilters({status: "All"}); }}>
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <h4>No Orders yet</h4>
                <p>Explore our curated coffee collections.</p>
                <button className={styles.ShopNowBtn} onClick={() => router.push("/shop")}>
                  Shop now
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isCancelPopupOpen && (
        <CancelOrderPopup
          orderId={selectedOrderId}
          onClose={() => setIsCancelPopupOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
      {isFilterPopupOpen && (
        <FilterOrdersPopup
          onClose={() => setIsFilterPopupOpen(false)}
          currentFilters={filters}
          onApply={(f) => setFilters(f)}
        />
      )}
    </div>
  );
}