"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavbarShop.module.css";
import beansImg from "./shop1.png";
import dripsImg from "./shop2.png";
import capsulesImg from "./shop3.png";
import merchImg from "./shop4.png";
import { formatImageUrl } from "@/lib/imageUtils";

const NavbarShop = ({ onClose, categories = [] }) => {
  return (
    <div className={styles.megaMenuContainer}>
      <div className={styles.imageGrid}>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            onClick={onClose}
            className={styles.gridItem}
          >
            <div className={styles.imageWrapper}>
              {cat.image?.url && (
                <Image
                  src={formatImageUrl(cat.image.url) || beansImg}
                  alt={cat.title}
                  width={281}
                  height={386}
                  className={styles.featuredImage}
                />
              )}
            </div>
            <p className={styles.Label}>{cat.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavbarShop;
