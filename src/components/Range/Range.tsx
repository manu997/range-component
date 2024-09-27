import React, { useEffect, useRef, useState } from 'react';
import styles from './Range.module.scss';
import { Dot } from '../Dot';

const Range = () => {
  const rangeRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(-1);

  useEffect(() => {
    const updateWidth = () => {
      if (rangeRef.current) {
        setContainerWidth(rangeRef.current.clientWidth);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className={styles.rangeContainer} ref={rangeRef}>
      <div className={styles.rangeLine} />
      <Dot containerWidth={containerWidth} initialPosition={0} />
      <Dot containerWidth={containerWidth} initialPosition={100} />
    </div>
  );
};

export default Range;
