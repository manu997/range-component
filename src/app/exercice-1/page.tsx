'use client';
import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice1.module.scss';

const Exercice1 = () => {
  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 1</h1>
        <Range />
      </main>
    </>
  );
};

export default Exercice1;
