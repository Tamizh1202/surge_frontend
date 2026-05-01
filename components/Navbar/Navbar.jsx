"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import logo from "./logo.png";
import NavbarShop from "./NavbarShop";
import { useCart } from "@/app/_context/CartContext";
import { useSession } from "next-auth/react";
import { useAuth } from "@/app/_context/AuthContext";

export default function Navbar({ categories = [] }) {
  const pathname = usePathname();
  const { isCartOpen, openCart, closeCart, items } = useCart();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const timeoutRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { data: session } = useSession();
  const lastScrollY = useRef(0);

  // 1. Pathname badalte hi menu band karne ka logic
  useEffect(() => {
    setMenuOpen(false);
    setIsShopOpen(false);
    setIsAccountOpen(false);
  }, [pathname]);

  const totalItems = items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsShopOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsShopOpen(false);
    }, 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScrollY.current && current > 60);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsAccountOpen(false);
      setMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => pathname === path;
  const isParentActive = (path) => pathname.startsWith(path);

  const handleShopClick = (e) => {
    e.preventDefault();
    setIsShopOpen(!isShopOpen);
  };

  const handleAccountClick = (e) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1300;
    if (isMobile) {
      e.preventDefault();
      setIsAccountOpen((v) => !v);
    }
  };

  return (
    <>
      <div
        className={`${styles.navOverlay} ${menuOpen ? styles.active : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <header className={`${styles.navbar} ${hidden ? styles.navbarHidden : ""}`}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <Image src={logo} alt="Logo" width={89} height={25} priority />
          </Link>
        </div>

        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? styles.lineOpen : ""}></span>
          <span className={menuOpen ? styles.lineOpen : ""}></span>
          <span className={menuOpen ? styles.lineOpen : ""}></span>
        </div>

        {/* 2. navWrapper par onClick lagaya taaki container/links pe click karte hi menu close ho jaye */}
        <div 
          className={`${styles.navWrapper} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(false)} 
        >
          <nav className={styles.menuCenter} onClick={(e) => e.stopPropagation()}>
            <div
              className={styles.shopTrigger}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/shop"
                className={`${styles.navLink} ${isParentActive("/shop") ? styles.activeRed : ""}`}
                onClick={handleShopClick}
              >
                Our Shop
                <span className={`${styles.arrow} ${isShopOpen ? styles.arrowUp : ""}`}>
                  <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="currentColor" />
                  </svg>
                </span>
              </Link>

              {isShopOpen && (
                <div className={`${styles.dropdownWrapper} ${isShopOpen ? styles.dropdownOpen : ""}`}>
                  <div className={styles.desktopOnly}>
                    <NavbarShop categories={categories} onClose={() => setIsShopOpen(false)} />
                  </div>
                  <div className={styles.mobileOnly}>
                    <ul className={styles.linkStack}>
                      {categories.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            href={`/shop/${cat.slug}`}
                            className={isActive(`/shop/${cat.slug}`) ? styles.activeRed : ""}
                            onClick={() => { setIsShopOpen(false); setMenuOpen(false); }}
                          >
                            {cat.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.mobileLine}></div>
            <Link href="/about-us" className={`${styles.navLink} ${isActive("/about-us") ? styles.activeRed : ""}`}>
              About Us
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/events" className={`${styles.navLink} ${isActive("/events") ? styles.activeRed : ""}`}>
              Events
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/ourmenu" className={`${styles.navLink} ${isActive("/ourmenu") ? styles.activeRed : ""}`}>
              Cafe Menu
            </Link>
          </nav>

          <nav className={styles.menuRight} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileLine}></div>
            <Link href="/contact" className={isActive("/contact") ? styles.activeRed : ""}>
              Contact Us
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/blogs" className={isActive("/blogs") ? styles.activeRed : ""}>
              Blogs
            </Link>
            
            <div className={styles.mobileLine}></div>
            {/* 3. Cart click par setMenuOpen(false) add kiya */}
            <span
              onClick={() => {
                setMenuOpen(false); 
                isCartOpen ? closeCart() : openCart();
              }}
              className={`${styles.navLink} ${isCartOpen ? styles.activeRed : ""}`}
              style={{ cursor: "pointer", position: "relative" }}
            >
              Cart 
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </span>
            
            <div className={styles.mobileLine}></div>
            {!session ? (
              <Link href="/auth" className={isActive("/Login") ? styles.activeRed : ""}>
                Login
              </Link>
            ) : (
              <div className={styles.accountTrigger}>
                <Link
                  href="/account/profile"
                  className={`${styles.navLink} ${isParentActive("/account") ? styles.activeRed : ""}`}
                  onClick={handleAccountClick}
                >
                  Account
                  <span className={`${styles.arrow} ${isAccountOpen ? styles.arrowUp : ""}`}>
                    <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="currentColor" />
                    </svg>
                  </span>
                </Link>

                {isAccountOpen && (
                  <div className={styles.mobileOnly}>
                    <ul className={styles.accountStack}>
                      <li>
                        <Link
                          href="/account/profile"
                          className={isActive("/account/profile") ? styles.activeRed : ""}
                          onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/orders"
                          className={isActive("/account/orders") ? styles.activeRed : ""}
                          onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/whitemantis-beans"
                          className={isActive("/account/manage-subscription") ? styles.activeRed : ""}
                          onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}
                        >
                          Surge Rewards
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/wishlist"
                          className={isActive("/account/wishlist") ? styles.activeRed : ""}
                          onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}
                        >
                          Wishlist
                        </Link>
                      </li>
                      <li>
                        <span style={{ cursor: "pointer" }} onClick={handleLogout}>
                          Logout
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}