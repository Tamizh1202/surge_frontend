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

export default function Navbar() {
  const pathname = usePathname();
  const { isCartOpen, openCart, closeCart } = useCart();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const timeoutRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { data: session } = useSession();
  const lastScrollY = useRef(0);
  const handleMouseEnter = () => {
    // Clear any existing timer so it stays open
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsShopOpen(true);
  };

  const handleMouseLeave = () => {
    // Wait 300ms before closing (gives user a "grace period")
    timeoutRef.current = setTimeout(() => {
      setIsShopOpen(false);
    }, 800);
  };
  // ── Scroll hide/show ──────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      // hide when scrolling down past 60px, show when scrolling up
      setHidden(current > lastScrollY.current && current > 60);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Account: mobile only click, desktop hover ─────────────────

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

        <div className={`${styles.navWrapper} ${menuOpen ? styles.active : ""}`}>
          <nav className={styles.menuCenter}>

            <div className={styles.shopTrigger}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
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
                    <NavbarShop onClose={() => setIsShopOpen(false)} />
                  </div>

                  <div className={styles.mobileOnly}>
                    <ul className={styles.linkStack}>
                      <li>
                        <Link href="/shop/coffee-beans" className={isActive("/shop/coffee-beans") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                          Coffee beans
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop/coffee-dripbags" className={isActive("/shop/coffee-dripbags") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                          Coffee Drip bags
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop/coffee-capsules" className={isActive("/shop/coffee-capsules") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                          Coffee Capsules
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop/merchandise" className={isActive("/shop/Merchandise") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                          Merchandise
                        </Link>
                      </li>
                      {/* <li>
                        <Link href="/shop/Equipments" className={isActive("/shop/Equipments") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                          Equipments
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.mobileLine}></div>
            <Link href="/about-us" className={`${styles.navLink} ${isActive("/about-us") ? styles.activeRed : ""}`}>About Us</Link>
            <div className={styles.mobileLine}></div>
            <Link href="/events" className={`${styles.navLink} ${isActive("/events") ? styles.activeRed : ""}`}>Events</Link>
            <div className={styles.mobileLine}></div>
            <Link href="/ourmenu" className={`${styles.navLink} ${isActive("/ourmenu") ? styles.activeRed : ""}`}>Cafe Menu</Link>
          </nav>

          <nav className={styles.menuRight}>
            <div className={styles.mobileLine}></div>
            <Link href="/contact" className={isActive("/contact") ? styles.activeRed : ""}>Contact Us</Link>
            <div className={styles.mobileLine}></div>
            <Link href="/blogs" className={isActive("/blogs") ? styles.activeRed : ""}>Blogs</Link>

            <div className={styles.mobileLine}></div>
            {/* 3. Updated Cart Trigger */}
            <span
              onClick={() => (isCartOpen ? closeCart() : openCart())}
              className={`${styles.navLink} ${isCartOpen ? styles.activeRed : ""}`}
              style={{ cursor: "pointer" }}
            >
              Cart
            </span>
            <div className={styles.mobileLine}></div>
            {!session ? (
              <Link href="/auth" className={isActive("/Login") ? styles.activeRed : ""}>Login</Link>
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
                        <Link href="/account/profile" className={isActive("/account/profile") ? styles.activeRed : ""} onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}>Profile</Link>
                      </li>
                      <li>
                        <Link href="/account/orders" className={isActive("/account/orders") ? styles.activeRed : ""} onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}>Orders</Link>
                      </li>
                      <li>
                        <Link href="/account/manage-subscription" className={isActive("/account/manage-subscription") ? styles.activeRed : ""} onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}>Manage Subscription</Link>
                      </li>
                      <li>
                        <Link href="/account/wishlist" className={isActive("/account/wishlist") ? styles.activeRed : ""} onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}>Wishlist</Link>
                      </li>
                      <li>
                        <Link href="/account/logout" onClick={() => { setIsAccountOpen(false); setMenuOpen(false); }}>Logout</Link>
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