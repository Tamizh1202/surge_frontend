import styles from "./Landing.module.css";
import tablePng from "./table.png";  // import it properly

const BANNER_IMAGES = {
    "coffee-beans": "/banners/coffee-beans.png",
    "capsules": "/banners/capsules.png",
    "drip-bags": "/banners/drip-bags.png",
    "merchandise": "/banners/merchandise.png",
};

export default function Landing({ category }) {
    const bgImage = "/table.png";

    return (
        <section
            className={styles.bgImage}
            style={{ backgroundImage: `url(${bgImage})` }}
        />
    );
}