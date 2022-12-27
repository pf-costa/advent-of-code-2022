import { sum } from "lodash";
import readInput from "./utils/readInput";

const input = readInput(18);
const coords = input.map((l) => l.split(",").map(Number));

const matrix = Array.from(Array(coords.length)).map(() =>
  Array.from(Array(coords.length)).fill(0)
);

const getAdjacentPoints = ([x, y, z]: number[], index: number) => {
  for (let i = 0; i < coords.length; i++) {
    if (i === index) {
      continue;
    }

    if (matrix[i][index]) {
      continue;
    }

    const [x2, y2, z2] = coords[i];

    const isNeighbor =
      (Math.abs(x2 - x) === 1 && y2 === y && z2 === z) ||
      (x2 === x && Math.abs(y2 - y) === 1 && z2 === z) ||
      (x2 === x && y2 === y && Math.abs(z2 - z) === 1);

    if (isNeighbor) {
      matrix[index][i] = 1;
      matrix[i][index] = 1;
    }
  }
};

coords.forEach(getAdjacentPoints);

const total = matrix.reduce((acc, point) => {
  const collisions = sum(point);
  const sides = Math.abs(6 - collisions);

  return acc + sides;
}, 0);

console.table(total);
