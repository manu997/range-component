'use client';
import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice1.module.scss';
import { useMinMax } from 'root/services/useMinMax';

const Exercice1 = () => {
  const { data, isLoading } = useMinMax();

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 1</h1>
        <Range defaultMax={data.max} defaultMin={data.min} />
      </main>
    </>
  );
};

export default Exercice1;
