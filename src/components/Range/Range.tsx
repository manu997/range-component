import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Range.module.scss';

const Range = () => {
  const min = 0;
  const max = 100;

  const rangeRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null); // Saber cuál bullet se está arrastrando

  // Temporal states to manage inputs values
  const [tempMinValue, setTempMinValue] = useState(min);
  const [tempMaxValue, setTempMaxValue] = useState(max);

  /**
   * Calculate the new value based on the mouse position
   */
  const calculateNewValue = useCallback(
    (clientX: number, rangeRect: DOMRect, rangeWidth: number) => {
      const relativeX = clientX - rangeRect.left;
      const newValue = (relativeX / rangeWidth) * (max - min) + min;
      // Keep value between min and max
      return Math.max(min, Math.min(max, newValue));
    },
    [min, max]
  );

  /**
   * Manage mouse movement while dragging
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !rangeRef.current) return;

      const rangeRect = rangeRef.current.getBoundingClientRect();
      const rangeWidth = rangeRect.width;
      const newValue = calculateNewValue(e.clientX, rangeRect, rangeWidth);

      if (isDragging === 'min') {
        // Min value cannot be greater than max
        setMinValue(Math.min(newValue, maxValue - 1));
        setTempMinValue(Math.min(newValue, maxValue - 1));
      } else if (isDragging === 'max') {
        // Max value cannot be lower than min
        setMaxValue(Math.max(newValue, minValue + 1));
        setTempMaxValue(Math.max(newValue, minValue + 1));
      }
    },
    [isDragging, minValue, maxValue, calculateNewValue]
  );

  const handleMouseDown = (type: 'min' | 'max') => setIsDragging(type);

  const handleMouseUp = () => setIsDragging(null);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  /**
   * Validate and set the min value
   */
  const validateAndSetMinValue = useCallback(() => {
    const validMinValue = Math.min(Math.max(tempMinValue, min), maxValue - 1);
    setMinValue(validMinValue);
    setTempMinValue(validMinValue);
  }, [tempMinValue, min, maxValue]);

  /**
   * Validate and set the max value
   */
  const validateAndSetMaxValue = useCallback(() => {
    const validMaxValue = Math.max(Math.min(tempMaxValue, max), minValue + 1);
    setMaxValue(validMaxValue);
    setTempMaxValue(validMaxValue);
  }, [tempMaxValue, max, minValue]);

  return (
    <div className={styles.container}>
      <input
        value={Math.trunc(tempMinValue)}
        onChange={(e) => setTempMinValue(Number(e.target.value))}
        onBlur={validateAndSetMinValue}
        className={styles.input}
      />
      <div className={styles.rangeLine} ref={rangeRef}>
        <div
          className={`${styles.bullet} ${styles.active}`}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            backgroundColor: 'aqua',
          }}
          onMouseDown={() => handleMouseDown('min')}
        />
        <div
          className={`${styles.bullet} ${styles.active}`}
          style={{
            left: `${((maxValue - min) / (max - min)) * 100}%`,
            backgroundColor: 'red',
          }}
          onMouseDown={() => handleMouseDown('max')}
        />
      </div>
      <input
        value={Math.trunc(tempMaxValue)}
        onChange={(e) => setTempMaxValue(Number(e.target.value))}
        onBlur={validateAndSetMaxValue}
        className={styles.input}
      />
    </div>
  );
};

export default Range;
