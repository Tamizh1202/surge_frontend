"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./NavbarShop.module.css";


import beansImg from "./shop1.png";
import dripsImg from "./shop2.png";
import capsulesImg from "./shop3.png";
import merchImg from "./shop4.png";

const NavbarShop = ({ onClose }) => {
  const categories = [
    { name: "Coffee Beans", href: "/shop/coffee-beans", src: beansImg },
    { name: "Coffee Drips", href: "/shop/coffee-dripbags", src: dripsImg },
    { name: "Coffee Capsules", href: "/shop/coffee-capsules", src: capsulesImg },
    { name: "Merchandise", href: "/shop/merchandise", src: merchImg },
  ];

  return (
    <div className={styles.megaMenuContainer}>
      <div className={styles.imageGrid}>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            onClick={onClose}
            className={styles.gridItem}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={cat.src}
                alt={cat.name}
                width={281}
                height={386}
                className={styles.featuredImage}
              />
            </div>
            <p className={styles.Label}>{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavbarShop;