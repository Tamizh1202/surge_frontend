import dynamic from 'next/dynamic';
import styles from './page.module.css';

const SuccessClient = dynamic(() => import('./SuccessClient'), {
  ssr: false,
  loading: () => <div className={styles.Wrapper}><p>Loading...</p></div>,
});

export default function OrderSuccessPage() {
  return <SuccessClient />;
}
