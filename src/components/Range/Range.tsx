import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Range.module.scss';

const Range = () => {
  // TODO: Fetch from API
  const min = 0;
  const max = 100;

  const rangeRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);

  const [tempMinValue, setTempMinValue] = useState(min); // Para manejar inputs temporalmente
  const [tempMaxValue, setTempMaxValue] = useState(max);

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
      const newValue = Math.max(
        min,
        Math.min(
          max,
          ((e.clientX - rangeRect.left) / rangeWidth) * (max - min) + min
        )
      );

      if (isDragging === 'min') {
        const newMinValue = Math.min(newValue, maxValue - 1);
        setMinValue(newMinValue); // El valor de min no puede superar el valor de max
        setTempMinValue(newMinValue);
      } else if (isDragging === 'max') {
        const newMaxValue = Math.max(newValue, minValue + 1);
        setMaxValue(newMaxValue); // El valor de max no puede ser menor que min
        setTempMaxValue(newMaxValue);
      }
    },
    [isDragging, maxValue, minValue]
  );

  const handleMouseUp = () => {
    setIsDragging(null); // Dejar de arrastrar cuando se suelta el mouse
  };

  // Función para actualizar el valor mínimo desde el input
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMinValue(Number(e.target.value));
  };

  // Función para validar el valor mínimo cuando el usuario termina de escribir
  const handleMinInputBlur = () => {
    const validMinValue = Math.min(Math.max(tempMinValue, min), maxValue - 1);
    setMinValue(validMinValue);
    setTempMinValue(validMinValue);
  };

  // Función para actualizar el valor máximo desde el input
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMaxValue(Number(e.target.value));
  };

  // Función para validar el valor máximo cuando el usuario termina de escribir
  const handleMaxInputBlur = () => {
    const validMaxValue = Math.max(Math.min(tempMaxValue, max), minValue + 1);
    setMaxValue(validMaxValue);
    setTempMaxValue(validMaxValue);
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
        value={Math.trunc(tempMinValue)}
        onChange={handleMinInputChange}
        onBlur={handleMinInputBlur}
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
        onChange={handleMaxInputChange}
        onBlur={handleMaxInputBlur}
        className={styles.input}
      />
    </div>
  );
};

export default Range;
