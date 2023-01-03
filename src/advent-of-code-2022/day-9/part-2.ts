import readInput from "../utils/readInput";
import { getCommand, movePoint } from "./utils";

const input = readInput(9);
const visitedPositions = new Set<string>();

const rope = Array.from(new Array(10)).map(() => ({ x: 0, y: 0 }));
const head = rope[0];
const tail = rope[rope.length - 1];

input.forEach((line) => {
  const { amount, move } = getCommand(line);

  for (let index = 0; index < amount; index++) {
    // Move one by one
    head.x += move.x;
    head.y += move.y;

    // Move the tails
    for (let i = 1; i < rope.length; i++) {
      const previousNode = rope[i - 1];
      const body = rope[i];

      movePoint(body, previousNode);
    }

    visitedPositions.add(tail.x + "-" + tail.y);
  }
});

console.log(visitedPositions.size);
