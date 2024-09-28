import { CSSProperties, useCallback, useMemo, useState } from 'react';
import styles from './dot.module.scss';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface DotProps {
  initialPosition: { x: number; y: number };
  minValue?: number;
  setMinValue?: (value: number) => void;
  maxValue?: number;
  setMaxValue?: (value: number) => void;
}

const Dot = ({
  initialPosition,
  setMinValue,
  setMaxValue,
  minValue,
  maxValue,
}: DotProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const drag = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const release = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDrag = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      if (setMaxValue) setMaxValue(data.x);
      if (setMinValue) setMinValue(data.x);
    },
    [setMinValue, setMaxValue]
  );

  const customStyles: CSSProperties = useMemo(
    () => ({
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [isDragging]
  );

  return (
    <Draggable
      axis='x'
      bounds='parent'
      onDrag={handleDrag}
      defaultPosition={initialPosition}
      position={{ x: minValue ?? maxValue ?? 0, y: 0 }}
    >
      <div
        onMouseDown={drag}
        onMouseUp={release}
        style={customStyles}
        className={styles.dotContainer}
      >
        <div className={styles.dot} />
      </div>
    </Draggable>
  );
};

export default Dot;
