import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <img src="/images/logo.png" alt="Logo spacetraveling" />
      </div>
    </div>
  );
}
