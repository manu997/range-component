'use client';
import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice2.module.scss';
import { useGetFixedValues } from 'root/services/useGetFixedValues';

const Exercice2 = () => {
  const { data, isLoading } = useGetFixedValues();

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 2</h1>
        <Range fixedValues={data} />
      </main>
    </>
  );
};

export default Exercice2;
