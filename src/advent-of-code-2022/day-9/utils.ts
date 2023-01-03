import { create, normalize, Point } from "./vector";

export const getCommand = (
  line: string
): {
  move: Point;
  amount: number;
} => {
  const [command, value] = line.split(" ");
  const amount = +value;

  switch (command) {
    case "R":
      return {
        amount,
        move: {
          x: 1,
          y: 0,
        },
      };

    case "L":
      return {
        amount,
        move: {
          x: -1,
          y: 0,
        },
      };

    case "U":
      return {
        amount,
        move: {
          x: 0,
          y: 1,
        },
      };

    case "D":
      return {
        amount,
        move: {
          x: 0,
          y: -1,
        },
      };

    default:
      throw new Error("Invalid command: " + line);
  }
};

export const movePoint = (tail: Point, position: Point) => {
  const vector: Point = create(position, tail);

  const { x, y } = vector;

  let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  if (distance <= 1) {
    // Nothing to do
    return;
  }

  // Normalize the vector
  const normalized = normalize(vector);

  tail.x = position.x + Math.round(normalized.x);
  tail.y = position.y + Math.round(normalized.y);
};
