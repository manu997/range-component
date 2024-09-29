export const getFixedValues = async () => {
  try {
    const data = await fetch('http://demo3354008.mockable.io/fixed-values');
    const json = await data.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const getMinMax = async () => {
  try {
    const data = await fetch('http://demo3354008.mockable.io/min-max');
    const json = await data.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
