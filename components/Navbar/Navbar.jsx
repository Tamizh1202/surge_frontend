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
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [hidden, setHidden] = useState(false);
  const { data: session } = useSession();
  const lastScrollY = useRef(0);

  // 1. Pathname badalte hi menu band karne ka logic
  useEffect(() => {
    setMenuOpen(false);
    setIsShopOpen(false);
    setIsAccountOpen(false);
    closeCart();
  }, [pathname]);

  const totalItems = items?.length || 0;

  const handleMouseEnter = () => {
    if (window.innerWidth < 1300) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsClosing(false);
    setIsShopOpen(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1300) return;
    timeoutRef.current = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsShopOpen(false);
        setIsClosing(false);
      }, 300);
    }, 150);
  };

  const navRef = useRef(null); // add this ref

  // Replace your scroll useEffect with this:
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 60) {
        navRef.current?.style.setProperty("transform", "translateY(-100%)");
      } else {
        navRef.current?.style.setProperty("transform", "translateY(0)");
      }
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
      <header ref={navRef} className={styles.navbar}>
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

              {(isShopOpen || isClosing) && (
                <div className={`${styles.dropdownWrapper} ${isShopOpen && !isClosing ? styles.dropdownOpen : ""}`}>
                  <div className={styles.desktopOnly}>
                    <NavbarShop categories={categories} isClosing={isClosing} onClose={() => setIsShopOpen(false)} />
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
            <Link
              href="/about-us"
              prefetch={false}
              className={`${styles.navLink} ${isParentActive("/about-us") ? styles.activeRed : ""}`}
            >
              About Us
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/events" className={`${styles.navLink} ${isParentActive("/events") ? styles.activeRed : ""}`}>
              Events
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/ourmenu" className={`${styles.navLink} ${isParentActive("/ourmenu") ? styles.activeRed : ""}`}>
              Cafe Menu
            </Link>
          </nav>

          <nav className={styles.menuRight} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileLine}></div>
            <Link href="/contact" className={isParentActive("/contact") ? styles.activeRed : ""}>
              Contact Us
            </Link>
            <div className={styles.mobileLine}></div>
            <Link href="/blogs" className={isParentActive("/blogs") ? styles.activeRed : ""}>
              Blogs
            </Link>

            <div className={`${styles.mobileLine} ${styles.desktopOnlyCart}`}></div>
            <span
              onClick={() => {
                setMenuOpen(false);
                isCartOpen ? closeCart() : openCart();
              }}
              className={`${styles.navLink} ${styles.desktopOnlyCart} ${isCartOpen ? styles.activeRed : ""}`}
              style={{ cursor: "pointer", position: "relative" }}
            >
              Cart {totalItems > 0 && `(${totalItems})`}
            </span>

            {/* <div className={styles.mobileLine}></div> */}
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: 'translateY(8%)' }}
                  >
                    <path d="M9 0C10.1935 0 11.3381 0.474106 12.182 1.31802C13.0259 2.16193 13.5 3.30653 13.5 4.5C13.5 5.69347 13.0259 6.83807 12.182 7.68198C11.3381 8.52589 10.1935 9 9 9C7.80653 9 6.66193 8.52589 5.81802 7.68198C4.97411 6.83807 4.5 5.69347 4.5 4.5C4.5 3.30653 4.97411 2.16193 5.81802 1.31802C6.66193 0.474106 7.80653 0 9 0ZM9 2.25C8.40326 2.25 7.83097 2.48705 7.40901 2.90901C6.98705 3.33097 6.75 3.90326 6.75 4.5C6.75 5.09674 6.98705 5.66903 7.40901 6.09099C7.83097 6.51295 8.40326 6.75 9 6.75C9.59674 6.75 10.169 6.51295 10.591 6.09099C11.0129 5.66903 11.25 5.09674 11.25 4.5C11.25 3.90326 11.0129 3.33097 10.591 2.90901C10.169 2.48705 9.59674 2.25 9 2.25ZM9 10.125C12.0037 10.125 18 11.6213 18 14.625V18H0V14.625C0 11.6213 5.99625 10.125 9 10.125ZM9 12.2625C5.65875 12.2625 2.1375 13.905 2.1375 14.625V15.8625H15.8625V14.625C15.8625 13.905 12.3413 12.2625 9 12.2625Z" fill="currentColor" />
                  </svg>

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
                          href="/account/surge-beans"
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
        <div
          className={`${styles.cartIconMobile} ${styles.mid}`}
          onClick={() => { isCartOpen ? closeCart() : openCart(); }}
          style={{ position: "relative" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'inline-block', position: 'relative', top: '6px' }}
          >
            <path d="M0.75 0.75H2.75L5.41 13.17C5.50758 13.6249 5.76067 14.0315 6.12571 14.3199C6.49075 14.6082 6.94491 14.7603 7.41 14.75H17.19C17.6452 14.7493 18.0865 14.5933 18.441 14.3078C18.7956 14.0224 19.0421 13.6245 19.14 13.18L20.79 5.75H3.82M7.7 19.7C7.7 20.2523 7.25228 20.7 6.7 20.7C6.14772 20.7 5.7 20.2523 5.7 19.7C5.7 19.1477 6.14772 18.7 6.7 18.7C7.25228 18.7 7.7 19.1477 7.7 19.7ZM18.7 19.7C18.7 20.2523 18.2523 20.7 17.7 20.7C17.1477 20.7 16.7 20.2523 16.7 19.7C16.7 19.1477 17.1477 18.7 17.7 18.7C18.2523 18.7 18.7 19.1477 18.7 19.7Z" stroke="#414343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {totalItems > 0 && (
            <span className={styles.cartBadge}>{totalItems}</span>
          )}
        </div>
      </header>
    </>
  );
}