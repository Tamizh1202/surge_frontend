import Image from 'next/image';
import Link from 'next/link';
import styles from './Addone.module.css';

import img1 from './m1.png';
import img2 from './m2.png';
import img3 from './m3.png';

export const coffeeData = [
  {
    title: "Water Options",
    desc: "Premium bottled water for meetings and small gatherings.",
    points: ["Aqua Panna glass water", "San Pellegrino sparkling water"],
    img: img1
  },
  {
    title: "Sweet Bites",
    desc: "Perfect little treats to pair with every cup.",
    points: [
      "Truffles (Oreo, Lotus)",
      "Mini cookies (Choco chip, Macadamia, Strawberry cream cheese, red velvet)",
      "Mini brownies (Brokies, Oats)",
      "Mini Croissant (Plain, Cheese, Zataar, Almond)"
    ],
    img: img2
  },
  {
    title: "Canapés",
    desc: "Savory selections for elevated catering.",
    points: ["Breakfast burger", "Bruschetta bites", "Tuna crostini", "Turkey cheese bagel"],
    img: img3
  },
];

export default function CoffeeGrid() {
  return (
    <main className={styles.container}>
      <h2 className={styles.sectionHeading}>Add-ons Menu</h2>

      <div className={styles.grid}>
        {coffeeData.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.img}
                alt={item.title}

                className={styles.mainImg}

              />
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>

              <ul className={styles.pointsList}>
                {item.points.map((point, i) => (



                  <li key={i} className={styles.pointItem}>
                    <span className={styles.squareIcon}>
  <svg width="6" height="6" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="6" height="6" fill="#818686"/>
</svg>

</span>
                    {point}
                  </li>
                ))}
              </ul>

              <a href="#enquiry-form" className={styles.enquireLink}>
                Enquire Now
                <span className={styles.arrow}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201" stroke="#C4754E" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}