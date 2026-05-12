import styles from './Moments.module.css';
import Image from "next/image";
import img1 from './1.webp';
import img2 from './2.webp';
import img3 from './3.webp';
import img4 from './4.webp';
import img5 from './5.webp';

export default function Moments() {
    return (
        <section className={styles.momentsContainer}>
            {/* Left Column - Large Image (741x849) */}
            <div className={styles.leftSection}>
                <div className={styles.textContent}>
                    <h1 className={styles.text}>Moments from Surge</h1>
                </div>
                <div className={styles.imageWrapper}>
                    <Image
                        src={img1}
                        alt="Primary Surge Moment"
                        className={styles.productImg}
                        width={741}
                        height={849}
                        priority
                    />
                </div>
            </div>

            {/* Right Column - Grid of 4 (444x416 each) */}
            <div className={styles.rightSection}>
                <div className={styles.imageWrapper}>
                    <Image src={img2} alt="Moment 2" className={styles.productImg} width={444} height={416} />
                </div>
                <div className={styles.imageWrapper}>
                    <Image src={img3} alt="Moment 3" className={styles.productImg} width={444} height={416} />
                </div>
                <div className={styles.imageWrapper}>
                    <Image src={img4} alt="Moment 4" className={styles.productImg} width={444} height={416} />
                </div>
                <div className={styles.imageWrapper}>
                    <Image src={img5} alt="Moment 5" className={styles.productImg} width={444} height={416} />
                </div>
            </div>
        </section>
    );
}