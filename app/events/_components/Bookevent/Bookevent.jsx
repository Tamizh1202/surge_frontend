
import styles from "./Bookevent.module.css";
import Image from "next/image";

import Eimg1 from './Eimg1.webp';
import Eimg2 from './Eimg2.webp';
import Eimg4 from './Eimg4.webp';
import Eimg3 from './Eimg3.webp';
import Eimg5 from './Eimg5.webp';
import Eimg6 from './Eimg6.webp';

const partnershipsData = [
  { id: 1, src: Eimg1 },
  { id: 2, src: Eimg2 },
  { id: 3, src: Eimg4 },
  { id: 4, src: Eimg3 },
  { id: 5, src: Eimg5 },
  { id: 6, src: Eimg6 },
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