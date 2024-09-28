import { useQuery } from '@tanstack/react-query';

const getFixedValues = async () => {
  try {
    const data = await fetch('https://demo3354008.mockable.io/fixed-values');
    const json = await data.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const useGetFixedValues = () =>
  useQuery({
    queryKey: ['minMax'],
    queryFn: getFixedValues,
  });
