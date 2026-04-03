import styles from "./Shop.module.css";
import Image from "next/image";
import Link from "next/link";
import one from "./Coffee1.jpg";
import two from "./Coffee2.jpg";
import three from "./Coffee3.jpg";

const categories = [
  { 
    id: 1, 
    name: "Coffee Beans", 
    description: "Freshly roasted specialty beans crafted for balance and clarity. Designed for consistent performance across espresso and filter brewing",
    img: one, 
    link: "/shop/coffee-beans" 
  },
  { 
    id: 2, 
    name: "Coffee Drip Bags", 
    description: "Single-serve drip bags crafted for convenience without compromising flavour. Perfectly pre-measured for a smooth, balanced cup.",
    img: two, 
    link: "/shop/coffee-dripbags" 
  },
  { 
    id: 3, 
    name: "Coffee Capsules", 
    description: "Precision-packed capsules designed for rich aroma and consistent extraction. Made for effortless brewing with bold flavour in every cup.",
    img: three, 
    link: "/shop/coffee-capsules" 
  },
];

const Shop = () => {
  return (
    <section className={styles.shopSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Shop by Category</h2>
        
        <div className={styles.grid}>
          {categories.map((item) => (
            <Link href={item.link} key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.img} 
                  alt={item.name} 
                  fill 
                  style={{ objectFit: "cover" }} 
                  priority
                  className={styles.bgImage}
                />
                <div className={styles.label}>
                  <p className={styles.categoryName}>{item.name}</p>
                  
               
                  <div className={styles.hoverContent}>
                    <p className={styles.mobileDescription}>{item.description}</p>
                    <button className={styles.mobileBtn}>Shop now</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;