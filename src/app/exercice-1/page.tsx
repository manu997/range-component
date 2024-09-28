'use client';
import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice1.module.scss';
import { useGetMinMax } from 'root/services/useGetMinMax';

const Exercice1 = () => {
  const { data, isLoading } = useGetMinMax();

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
