import { curry } from "lodash";

enum Direction {
  North,
  East,
  South,
  West,
}

const directions = {
  // N, NE, or NW
  north: [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  // S, SE, or SW
  south: [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
  // W, NW, or SW
  west: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  east: [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};

type Elf = {
  x: number;
  y: number;
};

type Quadrant = {
  elves: Elf[];
};

const getKey = (column: number, row: number) => column + "-" + row;
const quadrants = new Map<string, Quadrant>();

const getQuadrantKey = curry(
  (quadrantSize: number, column: number, row: number) =>
    (column % quadrantSize) + "-" + (row % quadrantSize)
);

export const getQuandrants = (lines: string[], quadrantSize = 100) => {
  const getKey = getQuadrantKey(100);

  lines.map((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] !== ".") {
        continue;
      }

      const key = getKey(x % quadrantSize, y % quadrantSize);
      let quadrant = quadrants.get(key);

      if (!quadrant) {
        quadrant = {
          elves: [],
        };
        quadrants.set(key, quadrant);
      }

      const elf: Elf = {
        x,
        y,
      };

      quadrant.elves.push(elf);
    }
  });

  return quadrants;
};

const solve = (lines: string[]) => {
  const quadrants = getQuandrants(lines);

  
};
