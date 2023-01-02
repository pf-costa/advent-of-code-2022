import assert from "assert";
import readInputs from "./utils/readInputs";

const { input, example } = readInputs(21);

type Operation = () => number;

const parse = (lines: string[]) => {
  const monkeys = new Map<string, Operation>();

  lines.forEach((l) => {
    let [monkey, operation] = l.split(":");

    operation = operation.trimStart();

    if (!isNaN(+operation)) {
      monkeys.set(monkey, () => +operation);
      return;
    }

    const [_, monkey1, op, monkey2] = Array.from(
      operation.matchAll(/(\w+)\s(\+|\-|\*|\/)\s(\w+)/g)
    )[0];

    let command = undefined;

    switch (op) {
      case "+":
        command = () => monkeys.get(monkey1)() + monkeys.get(monkey2)();
        break;

      case "*":
        command = () => monkeys.get(monkey1)() * monkeys.get(monkey2)();
        break;

      case "-":
        command = () => monkeys.get(monkey1)() - monkeys.get(monkey2)();
        break;

      case "/":
        command = () => monkeys.get(monkey1)() / monkeys.get(monkey2)();
        break;

      default:
        throw new Error();
    }

    monkeys.set(monkey, command);
  });

  return monkeys;
};

const solve1 = (lines: string[]) => {
  const monkeys = parse(lines);

  return monkeys.get("root")();
};

const solve2 = (lines: string[]) => {
  const monkeys = parse(lines);

  monkeys.set("root", () => )

  return monkeys.get("root")();
};

// Part 1
assert.equal(solve1(example), 152);
assert.equal(solve1(input), 157714751182692);

// Part 2
