/* eslint-disable @typescript-eslint/no-explicit-any */
// Remove duplicates from an array
export const removeDuplicates = <T>(arr: T[]): T[] => [...new Set(arr)];

// Shuffle an array (Fisher-Yates Algorithm)
export const shuffleArray = <T>(arr: T[]): T[] => {
  return arr
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// Get the last element of an array
export const lastElement = <T>(arr: T[]): T | undefined => arr.at(-1);

// Flatten a nested array
export const flattenArray = <T>(arr: any[]): T[] => arr.flat(Infinity);

// Get the most frequent element in an array
export const mostFrequent = <T>(arr: T[]): null | T => {
  const count: Record<string, number> = {};
  let max = 0, result: null | T = null;

  for (const item of arr) {
    const key = JSON.stringify(item);
    count[key] = (count[key] || 0) + 1;
    if (count[key] > max) {
      max = count[key];
      result = item;
    }
  }
  return result;
};

// Chunk an array into smaller arrays of a specified size
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
};
