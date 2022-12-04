import { readInput } from "./utils";

const input = readInput(4);

const getAssignments = (line: string) => {
  return line.split(",").map((range) => range.split("-").map((n) => +n));
};

const fullyContains = ([minA, maxA]: number[], [minB, maxB]: number[]) => {
  return (minA <= minB && maxB <= maxA) || (minB <= minA && maxA <= maxB);
};

const intersects = ([minA, maxA]: number[], [minB, maxB]: number[]) => {
  return minA <= maxB && minB <= maxA;
};

const total = input.reduce(
  (acc, line) => {
    const [assign1, assign2] = getAssignments(line);

    if (fullyContains(assign1, assign2)) {
      acc.contains++;
    }

    if (intersects(assign1, assign2)) {
      acc.overlaps++;
    }

    return acc;
  },
  {
    contains: 0,
    overlaps: 0,
  }
);

console.log(total);
