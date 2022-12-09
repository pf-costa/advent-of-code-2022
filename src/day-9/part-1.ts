import { readInput } from "../utils";
import { getCommand, movePoint } from "./utils";

const input = readInput(9);

type Point = {
  x: number;
  y: number;
};

const visitedPositions = new Set<string>();

const head: Point = { x: 0, y: 0 };
const tail: Point = { x: 0, y: 0 };

input.forEach((line) => {
  const { amount, move } = getCommand(line);

  for (let index = 0; index < amount; index++) {
    // Move one by one
    head.x += move.x;
    head.y += move.y;

    movePoint(tail, head);

    visitedPositions.add(tail.x + "-" + tail.y);
  }
});

console.log(visitedPositions.size);
