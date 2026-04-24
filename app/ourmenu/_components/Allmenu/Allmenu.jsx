"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Allmenu.module.css";
import breakfast from "./breakfast.png";
import breads from "./bread.png";
import beverages from "./cake.png";
import desserts from "./pastry.png";
import axiosClient from "@/lib/axios";
import { useState, useEffect } from "react";
import { formatImageUrl } from "@/lib/imageUtils";

export default function Menu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop");
  const selectedCategory = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [availableCategoryIds, setAvailableCategoryIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catRes = await axiosClient.get("/api/app-categories");
        if (catRes.status === 200 && catRes.data.docs) {
          setCategories(catRes.data.docs);
        }

        // Fetch products if shopId exists to know which categories have items
        if (shopId) {
          const prodRes = await axiosClient.get(
            `/api/shop/${shopId}/menu-items?page=1&limit=100`
          );
          const items = prodRes.data.items || [];
          const ids = new Set(
            items.map((item) => item.category?.id).filter((id) => id != null)
          );
          setAvailableCategoryIds(ids);
        } else {
          setAvailableCategoryIds(new Set());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  const displayedCategories = shopId
    ? categories.filter((cat) => availableCategoryIds.has(cat.id))
    : categories;


  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("category") === String(categoryId)) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.menuSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.heading}>
            From Our Cafe {shopId ? `(${shopId})` : ""}
          </h2>
          <p className={styles.subtext}>
            Explore the drinks and bites served daily at Surge cafés. From
            espresso classics to signature creations and fresh desserts, every
            item is crafted with the same care as our coffee.
          </p>
        </div>
      </div>

      <div className={styles.menuGrid}>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          displayedCategories.map((category) => {
            // Mapping logic for static images

            let categoryImage = desserts;
            const slug = category.slug.toLowerCase();

            if (slug.includes("bakery") || slug.includes("bread")) {
              categoryImage = breads;
            } else if (slug.includes("beverage")) {
              categoryImage = beverages;
            } else if (slug.includes("breakfast")) {
              categoryImage = breakfast;
            }
            return (
              <div
                key={category.id}
                className={styles.card}
                onClick={() => handleCategoryClick(category.id)}
              >

                <div className={styles.imageWrapper}>
                  <Image
                    src={formatImageUrl(category.image.url) || categoryImage}
                    alt={category.title}
                    width={382}
                    height={507}
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardTitle}>{category.title}</div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

