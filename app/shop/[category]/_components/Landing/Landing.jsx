import styles from "./Landing.module.css";
import coffeeBeans from "./coffeebeans.webp";
import coffeeCapsules from "./coffeecapsules.webp";
import dripBags from "./dripbags.webp";

const BANNER_IMAGES = {
    "coffee-beans": coffeeBeans.src,
    "coffee-capsules": coffeeCapsules.src,
    "coffee-drip-bags": dripBags.src,
    "merchandise": "/table.png",
};

export default function Landing({ category }) {
    const bgImage = BANNER_IMAGES[category] ?? coffeeBeans.src;

    return (
        <section
            className={styles.bgImage}
            style={{ backgroundImage: `url(${bgImage})` }}
        />
    );
}