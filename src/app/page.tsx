import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.menu}>
      <ul>
        <li>
          <Link href='/exercice-1'>Exercice 1</Link>
        </li>
        <li>
          <Link href='/exercice-2'>Exercice 2</Link>
        </li>
      </ul>
    </main>
  );
}
