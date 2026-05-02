import { Suspense } from 'react';
import SuccessClient from './SuccessClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className={styles.Wrapper}><p>Loading...</p></div>}>
      <SuccessClient />
    </Suspense>
  );
}