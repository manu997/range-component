'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './range.module.scss';
import { getClosestFixedValue } from '../../utils';

interface RangeProps {
  fixedValues?: number[];
  defaultMin?: number;
  defaultMax?: number;
}

const Range = ({ fixedValues, defaultMin, defaultMax }: RangeProps) => {
  const min = fixedValues ? Math.min(...fixedValues) : defaultMin ?? 0;
  const max = fixedValues ? Math.max(...fixedValues) : defaultMax ?? 100;

  const rangeRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

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
      const clampedValue = Math.max(min, Math.min(max, newValue));

      return fixedValues
        ? getClosestFixedValue(clampedValue, fixedValues)
        : clampedValue;
    },
    [min, max, fixedValues]
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
        //Avoid min value > max value
        const newMinValue = Math.min(newValue, maxValue - 1);
        const closestMin = getClosestFixedValue(newMinValue, fixedValues);

        // Avoid cross values when fixedValues
        if (fixedValues && closestMin >= maxValue) return;

        setMinValue(closestMin);
        setTempMinValue(closestMin);
      } else if (isDragging === 'max') {
        //Avoid max value < min value
        const newMaxValue = Math.max(newValue, minValue + 1);
        const closestMax = getClosestFixedValue(newMaxValue, fixedValues);

        // Avoid cross values when fixedValues
        if (fixedValues && closestMax <= minValue) return;

        setMaxValue(closestMax);
        setTempMaxValue(closestMax);
      }
    },
    [isDragging, minValue, maxValue, calculateNewValue, fixedValues]
  );
  const handleMouseDown = (type: 'min' | 'max') => setIsDragging(type);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

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
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
        data-testid='min-input'
        value={fixedValues ? tempMinValue : Math.trunc(tempMinValue)}
        onChange={(e) => setTempMinValue(Number(e.target.value))}
        onBlur={validateAndSetMinValue}
        className={styles.input}
        disabled={!!fixedValues}
      />
      <div className={styles.rangeLine} ref={rangeRef}>
        {fixedValues &&
          fixedValues.map((value) => (
            <div
              data-testid={`fixed-bullet-${value}`}
              key={value}
              className={styles.fixedBullet}
              style={{
                left: `${((value - min) / (max - min)) * 100}%`,
              }}
            />
          ))}
        <div
          onDragStart={(e) => e.preventDefault()} // Avoid bug while dragging
          data-testid='min-bullet'
          className={`${styles.bullet} ${styles.active}`}
          style={
            {
              '--bulletPosition': `${((minValue - min) / (max - min)) * 100}%`,
              '--bulletColor': 'aqua',
            } as React.CSSProperties
          }
          onMouseDown={() => handleMouseDown('min')}
        />
        <div
          onDragStart={(e) => e.preventDefault()} // Avoid bug while dragging
          data-testid='max-bullet'
          className={`${styles.bullet} ${styles.active}`}
          style={
            {
              '--bulletPosition': `${((maxValue - min) / (max - min)) * 100}%`,
              '--bulletColor': 'red',
            } as React.CSSProperties
          }
          onMouseDown={() => handleMouseDown('max')}
        />
      </div>
      <input
        data-testid='max-input'
        value={fixedValues ? tempMaxValue : Math.trunc(tempMaxValue)}
        onChange={(e) => setTempMaxValue(Number(e.target.value))}
        onBlur={validateAndSetMaxValue}
        className={styles.input}
        disabled={!!fixedValues}
      />
    </div>
  );
};

export default Range;
