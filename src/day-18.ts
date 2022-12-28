import { max, min, sum } from "lodash";
import readInput from "./utils/readInput";

const input = readInput(18);
const coords = input.map((l) => l.split(",").map(Number));

const getAdjacentPoints = (
  [x, y, z]: number[],
  index: number,
  matrix: Array<Array<number>>,
  coords: Array<Array<number>>
) => {
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

const getSides = (coords: Array<Array<number>>) => {
  let matrix = Array.from(Array(coords.length)).map(() =>
    Array.from(Array(coords.length)).fill(0)
  );

  coords.forEach((c, i) => getAdjacentPoints(c, i, matrix, coords));

  const total = matrix.reduce((acc, point) => {
    const collisions = sum(point);

    const sides = Math.abs(6 - collisions);

    return acc + sides;
  }, 0);

  return total;
};

// Part 1
console.log(getSides(coords));

// Part 2

const getOuterCube = (
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number
) => {
  const queue = [[minX, minY, minZ]];
  let cube = [];

  while (queue.length > 0) {
    const [x, y, z] = queue.shift();

    if (x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ) {
      continue;
    }

    if (cube.some((p) => p[0] === x && p[1] === y && p[2] === z)) {
      continue;
    }

    if (coords.some((p) => p[0] === x && p[1] === y && p[2] === z)) {
      continue;
    }

    queue.push([x - 1, y, z]);
    queue.push([x + 1, y, z]);

    queue.push([x, y - 1, z]);
    queue.push([x, y + 1, z]);

    queue.push([x, y, z - 1]);
    queue.push([x, y, z + 1]);

    cube.push([x, y, z]);
  }

  cube = cube.filter(
    ([x, y, z]) =>
      x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ
  );

  return cube;
};

const minX = min(coords.map((c) => c[0])) - 1;
const minY = min(coords.map((c) => c[1])) - 1;
const minZ = min(coords.map((c) => c[2])) - 1;

const maxX = max(coords.map((c) => c[0])) + 1;
const maxY = max(coords.map((c) => c[1])) + 1;
const maxZ = max(coords.map((c) => c[2])) + 1;

const cube = getOuterCube(minX, minY, minZ, maxX, maxY, maxZ);
const total = getSides(cube);

const width = maxX - minX + 1;
const height = maxY - minY + 1;
const depth = maxZ - minZ + 1;

const outerSurfaces =
  width * height * 2 + width * depth * 2 + height * depth * 2;

console.log(total - outerSurfaces);
