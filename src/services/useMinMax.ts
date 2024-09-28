import { useQuery } from '@tanstack/react-query';

const getMinMax = async () => {
  try {
    const data = await fetch('https://demo3354008.mockable.io/min-max');
    const json = await data.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

export const useMinMax = () =>
  useQuery({
    queryKey: ['minMax'],
    queryFn: getMinMax,
  });
