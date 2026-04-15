"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Pathname detect karne ke liye
import styles from "./Navbar.module.css";
import logo from "./logo.png";
import NavbarShop from "./NavbarShop";

export default function Navbar() {
  const pathname = usePathname(); 
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);

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
          
          <div className={styles.shopTrigger}>
            <Link 
              href="/shop" 
              className={`${styles.navLink} ${isParentActive("/shop") ? styles.activeRed : ""}`} 
              onClick={handleShopClick}
            >
              Our Shop 
              <span className={`${styles.arrow} ${isShopOpen ? styles.arrowUp : ""}`}>
                <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="currentColor"/>
                </svg>
              </span>
            </Link>

            {isShopOpen && (
              <div className={styles.dropdownWrapper}>
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
                    <li>
                      <Link href="/shop/Equipments" className={isActive("/shop/Equipments") ? styles.activeRed : ""} onClick={() => setIsShopOpen(false)}>
                        Equipments
                      </Link>
                    </li>
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
            <Link
            href=""
            onClick={() => (isCartOpen ? closeCart() : openCart())}
            className={pathname === "/CartSideBar" ? styles.active : ""}
            style={{ cursor: "pointer" }}
          > Cart</Link>
          
          <div className={styles.mobileLine}></div>
          <Link href="/Login" className={isActive("/Login") ? styles.activeRed : ""}>Login</Link>
          <div className={styles.mobileLine}></div>

          <div className={styles.accountTrigger}>
            <Link 
              href="/account/profile" 
              className={`${styles.navLink} ${isParentActive("/account") ? styles.activeRed : ""}`} 
              onClick={handleAccountClick}
            >
              / Account 
              <span className={`${styles.arrow} ${isAccountOpen ? styles.arrowUp : ""}`}>
                <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="currentColor"/>
                </svg>
              </span>
            </Link>

            {isAccountOpen && (
              <div className={styles.mobileOnly}>
                <ul className={styles.accountStack}>
                  <li>
                    <Link href="/account/profile" className={isActive("/account/profile") ? styles.activeRed : ""} onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Profile</Link>
                  </li>
                  <li>
                    <Link href="/account/orders" className={isActive("/account/orders") ? styles.activeRed : ""} onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Orders</Link>
                  </li>
                  <li>
                    <Link href="/account/manage-subscription" className={isActive("/account/manage-subscription") ? styles.activeRed : ""} onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Manage Subscription</Link>
                  </li>
                  <li>
                    <Link href="/account/wishlist" className={isActive("/account/wishlist") ? styles.activeRed : ""} onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Wishlist</Link>
                  </li>
                  <li>
                    <Link href="/account/logout" onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Logout</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}