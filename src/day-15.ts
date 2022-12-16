import readInput from "./utils/readInput";

type Line = {
  from: number;
  to: number;
};

const sensors = readInput(15).map((l) => {
  const [x1, y1, x2, y2] = Array.from(l.matchAll(/(\-?\d+)/g)).map((m) =>
    Number(m[0])
  );

  // Compute distance between to two points
  const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);

  return {
    x: x1,
    y: y1,
    distance,
  };
});

const getOccupiedPositions = (row: number) => {
  const items = sensors
    .filter(({ y, distance }) => y - distance <= row && y + distance >= row)
    // For each matching sensor compute the intersection
    .flatMap(({ y, x, distance }) => {
      if (y === row) {
        return { from: x - distance, to: x + distance };
      }

      const index = row > y ? row - y : y - row;

      return {
        from: x - distance + index,
        to: x + distance - index,
      };
    });

  const lines = items
    .sort((l1, l2) => l1.from - l2.from)
    // Check for intersections
    .reduce((acc, current) => {
      if (acc.length === 0) {
        return [current];
      }

      const previous = acc[acc.length - 1];

      // Do the lines overlap?
      if (previous.from <= current.from && current.from <= previous.to) {
        if (previous.to < current.to) {
          previous.to = current.to;
        }

        return acc;
      }

      return acc.concat(current);
    }, [] as Line[]);

  return lines.reduce((acc, l) => acc + (l.to - l.from), 0);
};

console.log(getOccupiedPositions(2000000));
