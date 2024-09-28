import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Range.module.scss';
import { Dot } from '../Dot';

const Range = () => {
  const MIN = 0;
  const MAX = 100;

  const rangeRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(-1);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);

  const valueInRange = useCallback(
    (value: number) => value >= MIN && value <= MAX,
    []
  );

  const parseValue = useCallback(
    (value: number) =>
      valueInRange(value) ? value : (value * 100) / containerWidth,
    [containerWidth, valueInRange]
  );

  const parseMaxPosition = useCallback(
    (e: string) => {
      const value = parseInt(e);
      if (!isNaN(value)) {
        setMaxValue((prev) => (valueInRange(parseValue(value)) ? value : prev));
      } else {
        setMaxValue(0);
      }
    },
    [valueInRange, parseValue]
  );

  const parseMinPosition = useCallback(
    (e: string) => {
      const value = parseInt(e);
      if (!isNaN(value)) {
        setMinValue((prev) => (valueInRange(parseValue(value)) ? value : prev));
      } else {
        setMinValue(0);
      }
    },
    [valueInRange, parseValue]
  );

  const initialMaxValue = useMemo(() => {
    const value = containerWidth * (maxValue / 100);
    return { x: value, y: 0 };
  }, [containerWidth, maxValue]);

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
    <div className={styles.container}>
      <input
        value={parseValue(minValue)}
        onChange={(e) => parseMinPosition(e.target.value)}
        className={styles.input}
      />
      <div className={styles.rangeContainer} ref={rangeRef}>
        <div className={styles.rangeLine} />
        <Dot
          setMinValue={setMinValue}
          minValue={minValue}
          initialPosition={{ x: 0, y: 0 }}
        />
        <Dot
          setMaxValue={setMaxValue}
          maxValue={maxValue}
          initialPosition={initialMaxValue}
        />
      </div>
      <input
        value={parseValue(maxValue)}
        onChange={(e) => parseMaxPosition(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};

export default Range;
