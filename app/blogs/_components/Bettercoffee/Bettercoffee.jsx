import Image from 'next/image';
import Link from 'next/link';
import styles from './Bettercoffee.module.css';

import img1 from './image1.png';
import img2 from './image2.png';
import img3 from './image3.png';
import img4 from './image4.png';
import img5 from './image5.png';


export const coffeeData = [
  {
    slug: "our-sourcing-journey",
    title: "From Bean to Cup: Our Sourcing Journey",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img1
  },
  {
    slug: "precision-roasting",
    title: "From Bean to Cup: precision-roasting",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img2
  },
  {
    slug: "coffee-culture",
    title: "From Bean to Cup: Our Sourcing Journey",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img3
  },
  {
    slug: "sustainable-farming",
    title: "From Bean to Cup: Our Sourcing Journey",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img4
  },
  {
    slug: "global-partnerships",
    title: "From Bean to Cup: Our Sourcing Journey",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img5
  },
  {
    slug: "quality-assurance",
    title: "From Bean to Cup: Our Sourcing Journey",
    desc: "How we work with producers and partners to bring exceptional coffee to your cup.",
    img: img1
  }
];

export default function CoffeeGrid() {
  return (
    <main className={styles.container}>
      <h2 className={styles.sectionHeading}>Explore the World of Better Coffee</h2>

      <div className={styles.grid}>
        {coffeeData.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.img}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>


              <Link href={`/blogs/${item.slug}`} className={styles.readMore}>
                Read More
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201" stroke="#C4754E" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.viewMoreBtn}>View More</button>
      </div>
    </main>
  );
}