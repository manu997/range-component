export const getClosestFixedValue = (value: number, fixedValues?: number[]) => {
  if (!fixedValues) return value;
  return fixedValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
};
