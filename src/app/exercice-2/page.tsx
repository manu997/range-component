import { Range } from 'root/components/Range';
import { BackLink } from 'root/components/BackLink';
import styles from './exercice2.module.scss';
import { getFixedValues } from 'root/services';

const Exercice2 = async () => {
  const fixedValues = await getFixedValues();

  console.info('Fixed values:', fixedValues);

  if (!fixedValues) return null;

  return (
    <>
      <header>
        <BackLink to='/' />
      </header>
      <main className={styles.content}>
        <h1>Exercice 2</h1>
        <Range fixedValues={fixedValues} />
      </main>
    </>
  );
};

export default Exercice2;
