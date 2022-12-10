import { readInput } from "./utils";

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
const signalStrengths = [] as Array<number>;
const instructions = input.flatMap(getInstructions);

// Part 1
instructions.forEach((instruction, index) => {
  const cycle = index + 1;

  if (cycle === limit) {
    limit += 40;
    signalStrengths.push(x * cycle);
  }

  instruction();
});

// Part 2
const crt = Array.from(Array(6)).map(() => Array.from(Array(40)));
x = 1;
limit = 20;
const columns = crt[0].length;

for (let row = 0, cycle = 1; row < crt.length; row++) {
  for (let column = 0; column < columns; column++, cycle++) {
    const instruction = instructions[row * columns + column];

    let pixel = ".";

    if (column >= x - 1 && column <= x + 1) {
      pixel = "#";
    }

    crt[row][column] = pixel;
    instruction();
  }
}

// console.log(signalStrengths.join(","), sum(signalStrengths));
crt.forEach((l) => console.log(l.join("")));
