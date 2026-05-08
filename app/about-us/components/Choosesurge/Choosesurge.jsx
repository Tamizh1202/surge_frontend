import styles from './Choosesurge.module.css'
import Image from "next/image";
import surgeImg from "./juice.png";
import surge2Img from "./juice2.png";
import surge3Img from "./juice3.png";
import surge4Img from "./juice4.png";

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
                    <p className={styles.description}>Premium beans, crafted to meet global specialty standards.</p>
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
                    <p className={styles.description}>A Dubai-rooted brand built on authenticity and local values.</p>
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
                    <p className={styles.description}>Premium beans, crafted to meet global specialty standards.</p>
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
                    <p className={styles.description}>Welcoming cafés that feel familiar—made for coffee and connection</p>
                </div>
            </div>
        </div>
    </div>
   )
}