export const generateDataset = (size = 10, min = 0, max = 10): number[] => {
  const range = Math.abs(max - min);
  return [...Array(size)].map(() => Math.floor(Math.random() * range - min));
};
