import { readInput } from "./utils";
import { sum } from "lodash";

const input = readInput(10);

type Instruction = () => void;

let x = 1;

const noop = () => undefined;

const getInstructions = (line: string): Instruction | Instruction[] => {
  const [command, value] = line.split(" ");

  switch (command) {
    case "noop":
      return noop;

    case "addx":
      return [
        noop,
        () => {
          x += +value;
        },
      ];

    default:
      throw new Error("Invalid line:" + line);
  }
};

let limit = 20;
let cycle = 0;

const signalStrengths = [] as Array<number>;

const tickCycle = () => {
  cycle++;

  if (cycle === limit) {
    limit += 40;
    signalStrengths.push(x * cycle);
  }
};

input.flatMap(getInstructions).forEach((instruction) => {
  tickCycle();
  instruction();
});

console.log(signalStrengths.join(","), sum(signalStrengths));
