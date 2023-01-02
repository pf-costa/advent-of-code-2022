import assert from "assert";
import readInputs from "./utils/readInputs";

var nerdamer = require("nerdamer");
require("nerdamer/Solve");

const { input, example } = readInputs(21);

type Operation = () => number;
type Operator = "-" | "+" | "/" | "*";
type Monkey = {
  operation: Operation;
  monkeys?: [string, string];
  operator?: Operator;
  value?: number;
};

const parseLine = (l: string) => {
  let [monkey, operation] = l.split(":");

  operation = operation.trimStart();

  if (!isNaN(+operation)) {
    return [monkey, +operation];
  }

  const [_, monkey1, op, monkey2] = Array.from(
    operation.matchAll(/(\w+)\s(\+|\-|\*|\/)\s(\w+)/g)
  )[0];

  return [monkey, monkey1, op, monkey2];
};

const parse = (lines: string[]) => {
  const monkeys = new Map<string, Monkey>();

  lines.forEach((l) => {
    const tokens = parseLine(l);

    if (tokens.length === 2) {
      monkeys.set(tokens[0] as string, {
        operation: () => tokens[1] as number,
        value: +tokens[1],
      });
      return;
    }

    const [monkey, monkey1, op, monkey2] = tokens as [
      string,
      string,
      string,
      string
    ];
    let command = undefined;

    switch (op) {
      case "+":
        command = () =>
          monkeys.get(monkey1).operation() + monkeys.get(monkey2).operation();
        break;

      case "*":
        command = () =>
          monkeys.get(monkey1).operation() * monkeys.get(monkey2).operation();
        break;

      case "-":
        command = () =>
          monkeys.get(monkey1).operation() - monkeys.get(monkey2).operation();
        break;

      case "/":
        command = () =>
          monkeys.get(monkey1).operation() / monkeys.get(monkey2).operation();
        break;

      default:
        throw new Error();
    }

    monkeys.set(monkey, {
      operation: command,
      monkeys: [monkey1, monkey2],
      operator: op,
    });
  });

  return monkeys;
};

const getConstant = (
  expected: number,
  constant: number,
  operator: Operator
) => {
  switch (operator) {
    case "+":
      return expected - constant;

    case "-":
      return expected + constant;

    case "/":
      return expected * constant;

    case "*":
      return expected / constant;

    default:
      throw new Error();
  }
};

const solve1 = (lines: string[]) => {
  const monkeys = parse(lines);

  return monkeys.get("root").operation();
};

const solve2 = (lines: string[]) => {
  const monkeys = parse(lines);

  const tryNode = (
    { monkeys: dependants, operator }: Monkey,
    expected: number
  ) => {
    let human = 0;

    monkeys.set("humn", {
      operation: () => {
        return human;
      },
    });

    if (dependants.includes("humn")) {
      const monkey = dependants.filter((d) => d !== "humn")[0];
      const value = monkeys.get(monkey).operation();

      // Solution!
      return getConstant(expected, value, operator);
    }

    let monkey1 = monkeys.get(dependants[0]);
    let monkey2 = monkeys.get(dependants[1]);

    let value1 = monkey1.operation();
    let value2 = monkey2.operation();

    human++;

    let value11 = monkey1.operation();
    let value22 = monkey2.operation();

    if (value11 !== value1) {
      const constant = getConstant(expected, value2, operator);

      return tryNode(monkey1, constant);
    } else if (value22 !== value2) {
      const constant = getConstant(expected, value1, operator);

      return tryNode(monkey2, constant);
    } else {
      debugger;
    }
  };

  const [_, monkey1, __, monkey2] = parseLine(
    lines.find((l) => l.startsWith("root"))
  ) as [string, string, string, string];

  monkeys.set("root", {
    operation: () =>
      monkeys.get(monkey1).operation() === monkeys.get(monkey2).operation()
        ? 1
        : 0,
    monkeys: [monkey1, monkey2],
  });

  // Get the never changing part of root
  {
    let human = 0;

    monkeys.set("humn", {
      operation: () => {
        return human;
      },
    });

    let mk1 = monkeys.get(monkey1);
    let mk2 = monkeys.get(monkey2);

    let value1 = mk1.operation();
    let value2 = mk2.operation();

    human++;

    let value11 = mk1.operation();

    // Did the first part change?
    if (value1 !== value11) {
      // Consider the second part as a constant
      return tryNode(mk1, value2);
    } else {
      // Consider the second part as a constant
      return tryNode(mk2, value1);
    }
  }
};

const solve3 = (lines: string[]) => {
  const monkeys = parse(lines);

  const getEquation = ({ value, monkeys: dependants, operator }: Monkey) => {
    if (value) {
      return value;
    }

    const [part1, part2] = dependants.map((d) => {
      if (d === "humn") {
        return d;
      }

      return getEquation(monkeys.get(d));
    });

    return `(${part1} ${operator} ${part2})`;
  };

  const { monkeys: dependants } = monkeys.get("root");

  // Get the equation
  let part1 = getEquation(monkeys.get(dependants[0]));
  let part2 = getEquation(monkeys.get(dependants[1]));

  const equation = nerdamer.solveEquations(`${part1} = ${part2}`, "humn");

  return equation[0];
};

// Part 1
assert.equal(solve1(example), 152);
assert.equal(solve1(input), 157714751182692);

// Part 2
assert.equal(solve3(example), 301);

console.log(solve3(input));
