import shortestPath, { Graph } from "./utils/shortestPath";
import readInput from "./utils/readInput";

const graph: Graph = {};

const input = readInput(12);

const startChar = "S";
// Must be the tallest point
const sortedChars = input
  .flatMap((l) => Array.from(l))
  .sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0));

const maxCharCode = sortedChars[0];
const endChar = "E";

const getNormalizedCharValue = (char: string): number => {
  if (char === startChar) {
    return 1;
  }

  if (char === endChar) {
    return getNormalizedCharValue(maxCharCode) + 1;
  }

  return char.charCodeAt(0) - 96;
};

const getKey = (num1: number, num2: number) => {
  return num1 + "/" + num2;
};

const positions = [
  // left
  [-1, 0],
  // down
  [1, 0],
  // right
  [0, 1],
  // top
  [0, -1],
];

const getNeighbours = (charValue: number, row: number, column: number) => {
  const neighbours = positions.reduce((acc, [x, y]) => {
    const targetX = row + y;
    const targetY = column + x;

    const target = input[targetX]?.[targetY];

    if (target) {
      const normalized = getNormalizedCharValue(target);
      const diff = normalized - charValue;

      if (diff > 1) {
        // Cannot climb to this char
        return acc;
      }

      const cost = diff < 0 ? 4 : normalized > charValue ? 2 : 1;
      const key = getKey(targetX, targetY);

      return {
        ...acc,
        [key]: cost,
      };
    }
    return acc;
  }, {} as Record<string, number>);

  return neighbours;
};

input.forEach((line, lineIndex) => {
  for (let charIndex = 0; charIndex < line.length; charIndex++) {
    const char = line[charIndex];
    const charValue = getNormalizedCharValue(char);
    const neighbours = getNeighbours(charValue, lineIndex, charIndex);

    graph[getKey(lineIndex, charIndex)] = {
      ...neighbours,
    };
  }
});

function* getCoordFor(char: string) {
  for (let line = 0; line < input.length; line++) {
    for (let column = 0; column < input[0].length; column++) {
      if (char === input[line][column]) {
        yield getKey(line, column);
      }
    }
  }
}

const start = getCoordFor(startChar).next().value as string;
const end = getCoordFor(endChar).next().value as string;

// Part 1
const path = shortestPath(graph, start, end);
console.log(path);

// Part 2
const poss = Array.from(getCoordFor("a"))
  .map((a) => shortestPath(graph, a, end))
  .filter((p) => p !== undefined && p !== null)
  .sort((p1, p2) => (p1 as any)?.length - (p2 as any)?.length);

console.log(poss[0]?.length);
