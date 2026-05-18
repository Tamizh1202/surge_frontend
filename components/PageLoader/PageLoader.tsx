import Image from "next/image";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className={styles.overlay}>
      <Image src="/loader.gif" alt="Loading..." width={150} height={150} unoptimized />
    </div>
  );
}
