import { useCallback, useMemo, useState } from 'react';
import styles from './dot.module.scss';

interface DotProps {
  color?: string;
  initialSize?: number;
}

const Dot = ({ color = 'white', initialSize = 20 }: DotProps) => {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);

  const expand = useCallback(() => {
    setSize((prev) => prev * 1.5);
  }, [setSize]);

  const shrink = useCallback(() => {
    setSize(initialSize);
  }, [initialSize, setSize]);

  const drag = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const release = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const customStyles = useMemo(
    () => ({
      width: size,
      height: size,
      backgroundColor: color,
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [color, size, isDragging]
  );

  return (
    <span
      onMouseEnter={expand}
      onMouseLeave={shrink}
      onMouseDownCapture={drag}
      onMouseUpCapture={release}
      className={styles.dot}
      style={customStyles}
    />
  );
};

export default Dot;
