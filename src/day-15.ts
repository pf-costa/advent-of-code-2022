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

// Part 1 / 2
const max = 4000000;
const getValue = (v: number) => {
  if (v < 0) {
    return 0;
  }

  return v > max ? max : v;
};

const getOccupiedPositions = (row: number) => {
  const items = sensors
    .filter(({ y, distance }) => y - distance <= row && y + distance >= row)

    // For each matching sensor compute the intersection
    .flatMap(({ y, x, distance }) => {
      if (y === row) {
        return { from: getValue(x - distance), to: getValue(x + distance) };
      }

      const index = row > y ? row - y : y - row;

      return {
        from: getValue(x - distance + index),
        to: getValue(x + distance - index),
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

  const count = lines.reduce((acc, l) => acc + (l.to - l.from), 0);

  return {
    lines,
    count,
  };
};

// Part 1
//getOccupiedPositions(2000000);

// Part 2
for (let i = 0; i < max; i++) {
  const { lines, count } = getOccupiedPositions(i);

  if (max - count === 2 && lines.length === 2) {
    console.log(lines, count);

    const x = lines[0].to + 1;
    const frequency = x * 4000000 + i;
    console.log(frequency);

    break;
  }
}
