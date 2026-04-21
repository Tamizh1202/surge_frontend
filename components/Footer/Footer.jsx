"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import logo from "./Footer.png";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/auth")) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.promoSection}>
          <div className={styles.logoCol}>
            <Image
              src={logo}
              alt="Surge Logo"
              width={105}
              height={125}
              className={styles.footerLogo}
            />
          </div>

          <div className={styles.promoRightSide}>
            <div className={styles.promoCol}>
              <h3 className={styles.promoHeading}>Every cup earns more.</h3>
              <p className={styles.promoLabel}>Surge Rewards</p>
              <p className={styles.promoDesc}>
                Join Surge Rewards earn points on every purchase and redeem for free coffee, exclusives, and perks.
              </p>
              <Link href="/rewards" className={styles.exploreBtn}>Explore Rewards</Link>
            </div>

            <div className={styles.promoCol}>
              <h3 className={styles.promoHeading}>Your coffee ritual, in your pocket.</h3>
              <p className={styles.promoLabel}>Surge App</p>
              <p className={styles.promoDesc}>
                Order ahead, track brews, unlock member-only drops, and manage everything in one place.
              </p>
              <div className={styles.appLinks}>
                <Link href="#" className={styles.appBtn}>
                  <div className={styles.btnContent}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 20.5V3.5C3 2.9 3.5 2.4 4.1 2.5L18.8 11.2C19.3 11.5 19.3 12.5 18.8 12.8L4.1 21.5C3.5 21.6 3 21.1 3 20.5Z" fill="white" />
                    </svg>
                    <div className={styles.textWrapper}>
                      <span className={styles.topText}>Get it on</span>
                      <span className={styles.bottomText}>Google Play</span>
                    </div>
                  </div>
                </Link>

                <Link href="#" className={styles.appBtn}>
                  <div className={styles.btnContent}>
                    <svg width="24" height="24" viewBox="0 0 256 315" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M213.8 150.5c.2 38.7 33.7 51.6 34.1 51.8-.3 1.1-5.3 18.2-17.1 35.5-10.2 14.9-20.8 29.8-37.4 30.1-16.3.3-21.5-9.6-40.2-9.6-18.7 0-24.5 9.3-40 9.9-15.8.6-27.8-16.1-38.1-30.9-21-30.3-37-85.4-15.4-122.9 10.7-18.6 30-30.4 50.8-30.7 15.8-.3 30.7 10.6 40.4 10.6 9.6 0 27.8-13 46.8-11.1 8 0.3 30.4 3.2 44.8 24.3-1.2.7-26.6 15.5-26.3 46.4zM174.6 65.4c8.5-10.3 14.2-24.6 12.6-38.9-12.3.5-27.2 8.2-36 18.5-7.9 9.1-14.8 23.8-13 37.7 13.8 1.1 27.9-7 36.4-17.3z" fill="white" />
                    </svg>
                    <div className={styles.textWrapper}>
                      <span className={styles.topText}>Download on the</span>
                      <span className={styles.bottomText}>App Store</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.topSection}>
          <div className={styles.newsletterArea}>
            <div className={styles.newsletterContent}>
              <h2 className={styles.heading}>Join Our Community</h2>
              <p className={styles.description}>
                Join our email list and take your coffee ritual further. Get early access to new releases, exclusive offers and thoughtful perks, plus expert brewing tips to help you make better coffee at home. Go behind the scenes to discover the stories, sourcing and craft behind every cup, and become part of a growing community united by a shared love for quality coffee.
              </p>
              <form className={styles.subscribeForm}>
                <input
                  type="email"
                  placeholder="Email address"
                  className={styles.input}
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className={styles.linkColumns}>
            <div className={styles.column}>
              <h4>Company</h4>
              <Link href="/about-us">About us</Link>
              <Link href="/events">Events</Link>
              <Link href="/ourmenu">Cafe Menu</Link>
              <Link href="/blogs">Blogs</Link>
              {/* <Link href="/careers">Careers</Link> */}
            </div>
            <div className={styles.column}>
              <h4>Shop</h4>
              <Link href="/shop/coffee-beans">Coffee Beans</Link>
              <Link href="/shop/coffee-capsules">Coffee Capsules</Link>
              <Link href="/shop/coffee-dripbags">Coffee Drip Bags</Link>
              <Link href="/shop/merchandise">Merchandise</Link>
            </div>
            <div className={styles.column}>
              <h4>Account</h4>
              <Link href="/account/profile">Profile</Link>
              <Link href="/account/orders">Orders</Link>
              <Link href="/account/wishlist">Wishlist</Link>
            </div>
            <div className={styles.column}>
              <h4>Support</h4>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>


        <div className={styles.surgeBackground}>
          <h1>
            <span>S</span>
            <span>U</span>
            <span>R</span>
            <span>G</span>
            <span>E</span>
          </h1>
        </div>


        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <p className={styles.label}>Our Store</p>
            <address>
              Warehouse #2 - 26<br />
              26th St - Al Qouz Ind.fourth, Al Quoz,
              Dubai
            </address>
          </div>

          <div className={styles.contactWrapper}>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Join Us</p>
              <a
                href="https://www.instagram.com/surge.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.accentLink}
              >
                Instagram ↗
              </a>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Phone</p>
              <Link href="tel:+9710589535337" className={styles.accentLink}>05 8953 5337</Link>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Email</p>
              <Link href="mailto:hello@whitemantis.ae" className={styles.accentLink}>hello@whitemantis.ae</Link>
            </div>
          </div>
        </div>


        <div className={styles.bottomBar}>
          <div className={styles.copyright}>© 2026 Surge</div>
          <div className={styles.legal}>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
          <div className={styles.crafted}>
            Crafted by <a href="https://integramagna.com" target="_blank" rel="noopener noreferrer">Integra Magna</a>
          </div>
        </div>
      </div>
    </footer>
  );
}