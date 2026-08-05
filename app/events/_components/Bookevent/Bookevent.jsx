
import styles from "./Bookevent.module.css";
import Image from "next/image";

import i1 from './i1.webp';
import i2 from './i2.webp';
import i3 from './i3.webp';
import i4 from './i4.webp';
import i5 from './i5.webp';
import i6 from './i6.webp';
import i7 from './i7.webp';
import i8 from './i8.webp';
import i9 from './i9.webp';
import i10 from './i10.webp';
import i11 from './i11.webp';
import i12 from './i12.webp';
import i13 from './i13.webp';
import i14 from './i14.webp';

const partnershipsData = [
  { id: 1, src: i1 },
  { id: 2, src: i2 },
  { id: 3, src: i3 },
  { id: 4, src: i4 },
  { id: 5, src: i5 },
  { id: 6, src: i6 },
  { id: 7, src: i7 },
  { id: 8, src: i8 },
  { id: 9, src: i9 },
  { id: 10, src: i10 },
  { id: 11, src: i11 },
  { id: 12, src: i12 },
  { id: 13, src: i13 },
  { id: 14, src: i14 },
];

const Partnerships = () => {
  const doubledData = [...partnershipsData, ...partnershipsData];

  return (
    <div className={styles.Main}>
      <div className={styles.MainConatiner}>

        <div className={styles.Bottom}>
          <div className={styles.Marquee}>
            <div className={styles.Track}>
              {doubledData.map((partner, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <Image
                    src={partner.src}
                    alt={`Coffee ${index}`}
                    fill
                    className={styles.PartnerLogo}
                    placeholder="blur"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className={styles.Content}>
          <h1 className={styles.Title}>Bold Coffee. Every Event. The Surge Way.</h1>
          <p className={styles.Subtitle}>
          A premium Surge coffee bar experience — purpose-built for offices, product launches, weddings, pop-ups, and private events across Dubai.
          </p>
          <a href='#enquiry-form' className={styles.eventButton}>Book an Event</a>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;