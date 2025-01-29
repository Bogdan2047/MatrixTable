import { Cell } from "../Types/Types";

export const generateMatrix = (M: number, N: number): Cell[][] => {
  const matrix: Cell[][] = [];
  let id = 0;

  for (let i = 0; i < M; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < N; j++) {
      row.push({
        id: id++,
        amount: Math.floor(Math.random() * 900) + 100,
      });
    }
    matrix.push(row);
  }

  return matrix;
};

export const calculateRowSum = (row: Cell[]): number =>
  row.reduce((sum, cell) => sum + cell.amount, 0);

export const calculatePercentile = (
  data: number[],
  percentile: number
): number => {
  const sorted = [...data].sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * sorted.length);
  return sorted[index] || 0;
};

export const findClosestCells = (
  matrix: Cell[][],
  target: number,
  X: number
): Cell[] => {
  const allCells = matrix.flat();
  allCells.sort(
    (a, b) => Math.abs(a.amount - target) - Math.abs(b.amount - target)
  );
  return allCells.slice(0, X);
};
