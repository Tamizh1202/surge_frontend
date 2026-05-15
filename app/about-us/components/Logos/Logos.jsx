"use client";
import React from "react";
import styles from "./Logos.module.css";
import Image from "next/image";

const partnershipsData = [
  { id: 1, src: "/Client Logo/Client logo 1.png", alt: "Partner 1" },
  { id: 2, src: "/Client Logo/Client logo 2.png", alt: "Partner 2" },
  { id: 3, src: "/Client Logo/Client logo 3.png", alt: "Partner 3" },
  { id: 4, src: "/Client Logo/Client logo 4.png", alt: "Partner 4" },
  { id: 5, src: "/Client Logo/Client logo 5.png", alt: "Partner 5" },
  { id: 6, src: "/Client Logo/Client logo 6.png", alt: "Partner 6" },
  { id: 7, src: "/Client Logo/Client logo 7.png", alt: "Partner 7" },
  { id: 8, src: "/Client Logo/Client logo 8.png", alt: "Partner 8" },
  { id: 9, src: "/Client Logo/Client logo 9.png", alt: "Partner 9" },
  { id: 10, src: "/Client Logo/Client logo 10.png", alt: "Partner 10" },
  { id: 11, src: "/Client Logo/Client logo 11.png", alt: "Partner 11" },
  { id: 12, src: "/Client Logo/Client logo 12.png", alt: "Partner 12" },
  { id: 13, src: "/Client Logo/Client logo 13.png", alt: "Partner 13" },
  { id: 14, src: "/Client Logo/Client logo 14.png", alt: "Partner 14" },
  { id: 15, src: "/Client Logo/Client logo 15.png", alt: "Partner 15" },
  { id: 16, src: "/Client Logo/Client logo 16.png", alt: "/Partner 16" },
];

const Partnerships = () => {

  const duplicatedLogos = [...partnershipsData, ...partnershipsData];

  return (
    <div className={styles.Main}>
      <div className={styles.MainContainer}>
        <div className={styles.Bottom}>
          <div className={styles.Marquee}>
            <div className={styles.Track}>
              {duplicatedLogos.map((partner, index) => (
                <div key={index} className={styles.LogoWrapper}>
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={150}
                    height={75}
                    className={styles.PartnerLogo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;