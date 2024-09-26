import React from 'react';
import styles from './Range.module.scss';
import { Dot } from '../Dot';

const Range = () => {
  return (
    <div className={styles.rangeContainer}>
      <Dot />
      <Dot />
    </div>
  );
};

export default Range;
