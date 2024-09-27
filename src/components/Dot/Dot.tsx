import { CSSProperties, useCallback, useMemo, useState } from 'react';
import styles from './dot.module.scss';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface DotProps {
  initialPosition: number;
  containerWidth: number;
}

const Dot = ({ initialPosition, containerWidth }: DotProps) => {
  const MIN_VALUE = 0;
  const MAX_VALUE = 100;

  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    x: initialPosition,
    y: 0,
  });

  const drag = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const release = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const calculateValue = useCallback(
    (clientX: number) => {
      const value = Math.round(
        (clientX / containerWidth) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE
      );
      setCurrentPosition({ x: value, y: 0 }); // Actualizar la posición
    },
    [containerWidth]
  );

  const handleDrag = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      calculateValue(data.x); // Llamar a la función con la posición actual
    },
    [calculateValue]
  );

  const setInitialPosition = useMemo(() => {
    const value = containerWidth * (initialPosition / 100);
    return { x: value, y: 0 };
  }, [containerWidth, initialPosition]);

  const customStyles: CSSProperties = useMemo(
    () => ({
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [isDragging]
  );

  if (containerWidth < 0) return null;

  console.info(setInitialPosition);

  return (
    <Draggable
      axis='x'
      bounds='parent'
      defaultPosition={setInitialPosition}
      onDrag={handleDrag}
    >
      <div
        onMouseDown={drag}
        onMouseUp={release}
        style={customStyles}
        className={styles.dotContainer}
      >
        <div className={styles.dot} />
        <input className={styles.label} value={currentPosition?.x % 100} />
      </div>
    </Draggable>
  );
};

export default Dot;
