'use client';
import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice2.module.scss';

const Exercice2 = () => {
  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 2</h1>
        <Range fixedValues={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} />
      </main>
    </>
  );
};

export default Exercice2;
