import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Range.module.scss';

const Range = () => {
  // TODO: Fetch from API
  const min = 0;
  const max = 100;

  const rangeRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null); // Saber cuál bullet se está arrastrando

  const handleMouseDown = (type: 'min' | 'max') => {
    setIsDragging(type);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !rangeRef.current) return;

      const rangeRect = rangeRef.current.getBoundingClientRect();
      const rangeWidth = rangeRect.width;

      // Asegurarse de que el valor esté dentro de los límites del rango
      let newValue = Math.max(
        min,
        Math.min(
          max,
          ((e.clientX - rangeRect.left) / rangeWidth) * (max - min) + min
        )
      );

      // Asegurarse de que el valor esté dentro de los límites del rango
      newValue = Math.max(min, Math.min(max, newValue));

      if (isDragging === 'min') {
        setMinValue(Math.min(newValue, maxValue - 1)); // El valor de min no puede superar el valor de max
      } else if (isDragging === 'max') {
        setMaxValue(Math.max(newValue, minValue + 1)); // El valor de max no puede ser menor que min
      }
    },
    [isDragging, maxValue, minValue]
  );

  const handleMouseUp = () => {
    setIsDragging(null); // Dejar de arrastrar cuando se suelta el mouse
  };

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
  }, [handleMouseMove, isDragging]);

  return (
    <div className={styles.container}>
      <input
        value={minValue.toFixed(2)}
        onChange={(e) =>
          setMinValue(Math.min(Number(e.target.value), maxValue - 1))
        }
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
        value={maxValue.toFixed(2)}
        onChange={(e) =>
          setMaxValue(Math.max(Number(e.target.value), minValue + 1))
        }
        className={styles.input}
      />
    </div>
  );
};

export default Range;
