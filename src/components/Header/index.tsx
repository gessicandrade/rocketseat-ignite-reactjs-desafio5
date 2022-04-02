import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Link href="/"><a><img src="/images/logo.png" alt="logo" /></a></Link>
      </div>
    </div>
  );
}
