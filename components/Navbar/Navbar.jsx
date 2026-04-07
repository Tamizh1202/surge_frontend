"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import logo from "./logo.png";
import NavbarShop from "./NavbarShop";

export default function Navbar() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShopClick = (e) => {
    e.preventDefault(); 
    setIsShopOpen(!isShopOpen);
  };

  
const handleAccountClick = (e) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1300;

    if (isMobile) {
      e.preventDefault();
      setIsAccountOpen(!isAccountOpen);
    } else {
      setIsAccountOpen(false); 
    }
  };

  return (
    <header className={styles.navbar}>
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
              className={styles.navLinkRed} 
              onClick={handleShopClick}
            >
              Our Shop 
              <span className={`${styles.arrow} ${isShopOpen ? styles.arrowUp : ""}`}><svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="#2F362A"/>
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
                      <Link href="/shop/coffee-beans" onClick={() => setIsShopOpen(false)}>
                        Coffee beans
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/coffee-dripbags" onClick={() => setIsShopOpen(false)}>
                        Coffee Drip bags
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/coffee-capsules" onClick={() => setIsShopOpen(false)}>
                        Coffee Capsules
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/Merchandise" onClick={() => setIsShopOpen(false)}>
                        Merchandise
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/Equipments" onClick={() => setIsShopOpen(false)}>
                        Equipments
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className={styles.mobileLine}></div>
          <Link href="/about-us" className={styles.navLink}>About Us</Link>
          <div className={styles.mobileLine}></div>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <div className={styles.mobileLine}></div>
          <Link href="/ourmenu" className={styles.navLink}>Cafe Menu</Link>
        </nav>

        <nav className={styles.menuRight}>
          <div className={styles.mobileLine}></div>
          <Link href="/contact">Contact Us</Link>
          <div className={styles.mobileLine}></div>
          <Link href="/blogs">Blogs</Link>

          <div className={styles.mobileLine}></div>
          <Link href="/cart">Cart</Link>
          
          <div className={styles.mobileLine}></div>
          <Link href="/Login">Login</Link>
<div className={styles.mobileLine}></div>


   <div className={styles.accountTrigger}>
 
  <Link 
    href="/account/profile" 
    className={styles.navLink} 
    onClick={handleAccountClick}
  >
    Account 
     <span className={`${styles.arrow} ${isShopOpen ? styles.arrowUp : ""}`}><svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.0625 0L0.000322342 6.75H12.1247L6.0625 0Z" fill="#2F362A"/>
</svg>
</span>
  </Link>

  {isAccountOpen && (
    <div className={styles.mobileOnly}>
      <ul className={styles.accountStack}>
        <li>
          <Link href="/account/profile" onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Profile</Link>
        </li>
        <li>
          <Link href="/account/orders" onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Orders</Link>
        </li>
        <li><Link href="/account/manage-subscription" onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Manage Subscription</Link>
        </li>
        <li>
          <Link href="/account/wishlist" onClick={() => {setIsAccountOpen(false); setMenuOpen(false);}}>Wishlist</Link>
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