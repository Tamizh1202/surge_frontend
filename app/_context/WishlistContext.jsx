"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios";
import { toast } from "react-hot-toast";

const WishlistContext = createContext(null);

const getWishlistProductId = (item) =>
  item.product?.value?.id || item.product?.id || item.product;

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const optimisticOverrides = useRef(new Map());
  const mutationVersions = useRef(new Map());

  const applyOptimisticOverrides = (wishlistItems) => {
    let nextItems = wishlistItems;

    optimisticOverrides.current.forEach((shouldExist, productId) => {
      const exists = nextItems.some(
        (item) => String(getWishlistProductId(item)) === productId
      );

      if (shouldExist && !exists) {
        nextItems = [...nextItems, { product: productId, optimistic: true }];
      }

      if (!shouldExist && exists) {
        nextItems = nextItems.filter(
          (item) => String(getWishlistProductId(item)) !== productId
        );
      }
    });

    return nextItems;
  };

  const nextMutationVersion = (productId) => {
    const id = String(productId);
    const nextVersion = (mutationVersions.current.get(id) || 0) + 1;
    mutationVersions.current.set(id, nextVersion);
    return nextVersion;
  };

  const isLatestMutation = (productId, version) =>
    mutationVersions.current.get(String(productId)) === version;

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/api/wishlist");
      setItems(applyOptimisticOverrides(data.wishlist?.items || data.items || []));
    } catch (e) {
      console.error("Error refreshing wishlist:", e);
      setItems(applyOptimisticOverrides([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") refresh();
    else if (status === "unauthenticated") {
      setItems([]);
      setLoading(false);
    }
  }, [status]);

  const add = async (productId) => {
    if (status !== "authenticated") {
      toast.error("Please login to add items to your wishlist!", {
        id: "wishlist-guest-error",
      });
      return;
    }

    const productKey = String(productId);
    const version = nextMutationVersion(productKey);
    let previousItems = [];
    optimisticOverrides.current.set(productKey, true);

    setItems((currentItems) => {
      previousItems = currentItems;
      return applyOptimisticOverrides(currentItems);
    });

    try {
      await axiosClient.post("/api/wishlist", { productId, origin: "store" });
      await refresh();
      if (isLatestMutation(productKey, version)) {
        optimisticOverrides.current.delete(productKey);
      }
    } catch (e) {
      if (isLatestMutation(productKey, version)) {
        optimisticOverrides.current.delete(productKey);
        setItems(previousItems);
      }
      console.error("Error adding to wishlist:", e);
      const resData = e?.response?.data;
      const backendMsg =
        resData?.message || resData?.error || resData?.errors?.[0]?.message;
    }
  };

  const remove = async (productId) => {
    if (status !== "authenticated") {
      toast.error("Please login to manage your wishlist!", {
        id: "wishlist-guest-error",
      });
      return;
    }

    const productKey = String(productId);
    const version = nextMutationVersion(productKey);
    let previousItems = [];
    optimisticOverrides.current.set(productKey, false);

    setItems((currentItems) => {
      previousItems = currentItems;
      return applyOptimisticOverrides(currentItems);
    });

    try {
      await axiosClient.delete("/api/wishlist", {
        data: { productId, origin: "store" },
      });
      await refresh();
      if (isLatestMutation(productKey, version)) {
        optimisticOverrides.current.delete(productKey);
      }
    } catch (e) {
      if (isLatestMutation(productKey, version)) {
        optimisticOverrides.current.delete(productKey);
        setItems(previousItems);
      }
      console.error("Error removing from wishlist:", e);
    }
  };

  const toggle = (productId) => {
    if (status !== "authenticated") {
      toast.error("Please login to use the wishlist!", {
        id: "wishlist-guest-error",
      });
      return;
    }
    const exists = items.find(
      (it) => String(getWishlistProductId(it)) === String(productId)
    );
    return exists ? remove(productId) : add(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, loading, add, remove, toggle, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext) || {};
