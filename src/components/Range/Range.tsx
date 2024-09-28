import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Range.module.scss';

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
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null); // Saber cuál bullet se está arrastrando

  // Temporal states to manage inputs values
  const [tempMinValue, setTempMinValue] = useState(min);
  const [tempMaxValue, setTempMaxValue] = useState(max);

  /**
   * Find the closest value in the fixedValues array
   */
  const getClosestFixedValue = useCallback(
    (value: number) => {
      if (!fixedValues) return value; // Si no hay valores fijos, usar el valor normal
      return fixedValues.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    },
    [fixedValues]
  );

  /**
   * Calculate the new value based on the mouse position
   */
  const calculateNewValue = useCallback(
    (clientX: number, rangeRect: DOMRect, rangeWidth: number) => {
      const relativeX = clientX - rangeRect.left;
      const newValue = (relativeX / rangeWidth) * (max - min) + min;
      // Keep value between min and max
      const clampedValue = Math.max(min, Math.min(max, newValue));

      // Si estamos en modo de valores fijos, ajusta al valor más cercano
      return fixedValues ? getClosestFixedValue(clampedValue) : clampedValue;
    },
    [min, max, fixedValues, getClosestFixedValue]
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
        const newMinValue = Math.min(newValue, maxValue - 1); // El valor de min no puede superar max
        const closestMin = getClosestFixedValue(newMinValue);

        // Si estamos en modo de valores fijos, evitamos que se cruce con el máximo
        if (fixedValues && closestMin >= maxValue) return;

        setMinValue(closestMin);
        setTempMinValue(closestMin);
      } else if (isDragging === 'max') {
        const newMaxValue = Math.max(newValue, minValue + 1); // El valor de max no puede ser menor que min
        const closestMax = getClosestFixedValue(newMaxValue);

        // Si estamos en modo de valores fijos, evitamos que se cruce con el mínimo
        if (fixedValues && closestMax <= minValue) return;

        setMaxValue(closestMax);
        setTempMaxValue(closestMax);
      }
    },
    [
      isDragging,
      minValue,
      maxValue,
      calculateNewValue,
      getClosestFixedValue,
      fixedValues,
    ]
  );
  const handleMouseDown = (type: 'min' | 'max') => setIsDragging(type);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    // Desconectar el mousemove y mouseup inmediatamente para evitar arrastre accidental
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

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
              key={value}
              className={styles.fixedBullet}
              style={{
                left: `${((value - min) / (max - min)) * 100}%`,
              }}
            />
          ))}
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
