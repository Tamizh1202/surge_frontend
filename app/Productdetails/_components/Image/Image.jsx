import Image from 'next/image';
import styles from './Image.module.css';
import image from './tree.webp';
import imageMob from './treeMob.webp';

export default function Section({ product = {} }) {
  return (
    <div className={styles.mainWrapper}>
      <section className={styles.container}>
        <Image
          src={image}
          alt="Sustainability"
          fill
          priority
          className={`${styles.bgImage} ${styles.bgDesktop}`}
        />
        <Image
          src={imageMob}
          alt="Sustainability"
          fill
          priority
          className={`${styles.bgImage} ${styles.bgMobile}`}
        />
        <div className={styles.overlay} />

        <div className={styles.content}>
          <h2 className={styles.title}>About our Farm</h2>
          
          <p className={styles.description}>
            {product.farmDescription}
            
          </p>
        </div>
      </section>
    </div>
  );
}