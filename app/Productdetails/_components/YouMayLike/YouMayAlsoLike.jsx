import Image from 'next/image';
import styles from './YouMayAlsoLike.module.css';

const products = [
    {
        id: 1,
        title: 'Indonesia Bamer Mariah Triple Wet Hull',
        subtitle: 'Citrus, nutty, chocolate',
        price: 60,
        currency: 'AED',
        image: '/images/coffee-bag-1.png',
    },
    {
        id: 2,
        title: 'Indonesia Bamer Mariah Triple Wet Hull',
        subtitle: 'Citrus, nutty, chocolate',
        price: 60,
        currency: 'AED',
        image: '/images/coffee-bag-2.png',
    },
    {
        id: 3,
        title: 'Indonesia Bamer Mariah Triple Wet Hull',
        subtitle: 'Citrus, nutty, chocolate',
        price: 60,
        currency: 'AED',
        image: '/images/coffee-bag-3.png',
    },
];

export default function YouMayAlsoLike() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>You may also like</h2>
            <div className={styles.grid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className={styles.productImage}
                            />
                            <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                                <svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 20 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 17.77L8.55 16.45C3.4 11.73 0 8.64 0 4.89C0 1.8 2.42 -0.01 5.5 -0.01C7.24 -0.01 8.91 0.81 10 2.09C11.09 0.81 12.76 -0.01 14.5 -0.01C17.58 -0.01 20 1.8 20 4.89C20 8.64 16.6 11.73 11.45 16.45L10 17.77Z"
                                        fill="white"
                                        fillOpacity="0.7"
                                        stroke="white"
                                        strokeWidth="0.5"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.title}>{product.title}</h3>
                            <p className={styles.subtitle}>{product.subtitle}</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>
                                    {product.currency} {product.price}
                                </span>
                                <button className={styles.addToCart}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}