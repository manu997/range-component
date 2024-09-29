import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice1.module.scss';
import { getMinMax } from 'root/services';

const Exercice1 = async () => {
  const minMax = await getMinMax();

  if (!minMax) return null;

  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 1</h1>
        <Range defaultMax={minMax.max} defaultMin={minMax.min} />
      </main>
    </>
  );
};

export default Exercice1;
