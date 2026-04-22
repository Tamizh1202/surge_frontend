import styles from "./Landing.module.css";

const BANNER_IMAGES = {
    "coffee-beans": "/banners/coffee-beans.png",
    "capsules": "/banners/capsules.png",
    "drip-bags": "/banners/drip-bags.png",
    "merchandise": "/banners/merchandise.png",
};

export default function Landing({ category }) {
    const bgImage = BANNER_IMAGES[category] || BANNER_IMAGES["coffee-beans"];

    return (
        <section
            className={styles.bgImage}
            style={{ backgroundImage: `url(${bgImage})` }}
        />
    );
}