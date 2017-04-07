export const add = (array1: number, array2: number) => {
  const biggestIndex = Math.max(array1.length, array2.length);

  // todo: fill out zeros
  const result = [];
  let shouldCarryOne = false;

  for (let i = 0; i < biggestIndex || shouldCarryOne ; i++) {
    const sum = (shouldCarryOne ? 1 : 0) +
      (array1[array1.length - 1 - i] || 0) +
      (array2[array2.length - 1 - i] || 0);

    shouldCarryOne = sum > 10;
    result[i] = shouldCarryOne ? sum - 10 : sum;
  }
  return result.reverse();
};