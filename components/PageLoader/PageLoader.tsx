'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className={styles.overlay}>
      <Image src="/loader.gif" alt="Loading..." width={150} height={150} unoptimized />
    </div>
  );
}
