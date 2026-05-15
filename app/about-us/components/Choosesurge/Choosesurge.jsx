import styles from './Choosesurge.module.css'
import Image from "next/image";
import surgeImg from "./juice.webp";
import surge2Img from "./juice2.webp";
import surge3Img from "./juice3.webp";
import surge4Img from "./juice4.webp";

export default function Choosesurge() {
   return(
    <div className={styles.main}>
        <div className={styles.top}>
            <h1 className={styles.text}>Why Choose Surge</h1>
        </div>

        <div className={styles.bottom}>
            <div className={styles.cardcontainer}>
                {/* Card 1 */}
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <Image
                          src={surgeImg}
                          alt="surge"
                          width={340}
                          height={366}
                          className={styles.product}
                          priority
                        />
                    </div>
                    <h2 className={styles.heading}>Specialty Coffee, Done Right</h2>
                    <p className={styles.description}>Selected and roasted to meet the highest global specialty standards — the difference is in every sip.</p>
                </div>

                {/* Card 2 */}
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <Image
                          src={surge2Img}
                          alt="surge"
                          width={340}
                          height={366}
                          className={styles.product}
                          priority
                        />
                    </div>
                    <h2 className={styles.heading}>Proudly Emirati-Owned</h2>
                    <p className={styles.description}>A Dubai-born brand, proudly Emirati-owned, built on authenticity and deep local values.</p>
                </div>

                {/* Card 3 */}
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <Image
                          src={surge3Img}
                          alt="surge"
                          width={340}
                          height={366}
                          className={styles.product}
                          priority
                        />
                    </div>
                    <h2 className={styles.heading}>Quality You Can Taste</h2>
                    <p className={styles.description}>From the very first sip, the difference is unmistakable. Quality you can taste, consistency you can count on.</p>
                </div>

                {/* Card 4 */}
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <Image
                          src={surge4Img}
                          alt="surge"
                          width={340}
                          height={366}
                          className={styles.product}
                          priority
                        />
                    </div>
                    <h2 className={styles.heading}>Spaces Built for Community</h2>
                    <p className={styles.description}>Welcoming cafés designed to feel like home — spaces made for great coffee and genuine connection.</p>
                </div>
            </div>
        </div>
    </div>
   )
}