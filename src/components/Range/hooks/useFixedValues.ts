import { useCallback } from 'react';

export const useFixedValues = (fixedValues?: number[]) => {
  const getClosestFixedValue = useCallback(
    (value: number) => {
      if (!fixedValues) return value;
      return fixedValues.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
    },
    [fixedValues]
  );

  return {
    /**
     * Find the closest value in the fixedValues array
     */ getClosestFixedValue,
  };
};
