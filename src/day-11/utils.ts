export type Monkey = {
  index: number;
  items: number[];
  counter: number;
  divisor: number;
  operation: (value: number) => number;
  test: (value: number) => number;
};

export const operators = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

export const getOperation = (line: string) => {
  const txt = line.split(":")[1];
  const [variable1, operator, variable2] = txt
    .split("=")[1]
    .split(" ")
    .filter((c) => c.length > 0);

  const getValue = (current: number, variable: string) =>
    variable === "old" ? current : +variable;

  const operation = operators[operator as "+" | "-" | "/" | "*"];

  if (!operation) {
    throw new Error("Invalid operator " + operator);
  }

  return (current: number) =>
    operation(getValue(current, variable1), getValue(current, variable2));
};

const getNumber = (line: string) => {
  const match = line.match(/\d+/);

  if (!match) {
    throw new Error("Invalid line " + line);
  }

  return Number(match[0]);
};

export const getTestCondition = (lines: string[]) => {
  const predicate = getNumber(lines[0]);
  const monkey1 = getNumber(lines[1]);
  const monkey2 = getNumber(lines[2]);

  return {
    w: (worryLevel: number) => {
      return worryLevel % predicate === 0 ? monkey1 : monkey2;
    },
    predicate,
  };
};

export const getMonkeys = (input: string[]) => {
  const monkeys: Monkey[] = [];

  while (input.length > 0) {
    const index = input.findIndex((i) => i == "");

    // Get the lines that represent a monkey's instructions
    const instructions = input.slice(0, index === -1 ? undefined : index);

    const startItems = instructions[1].split(":")[1].split(",").map(Number);
    const operation = getOperation(instructions[2]);

    const test = getTestCondition(instructions.slice(3));

    monkeys.push({
      divisor: test.predicate,
      counter: 0,
      items: startItems,
      index: monkeys.length,
      operation: operation,
      test: test.w,
    });

    // Stop conditions
    if (index === -1) {
      break;
    }

    input = input.slice(index + 1);
  }

  return monkeys;
};

export const processMonkey = (args: {
  monkey: Monkey;
  monkeys: Monkey[];
  reliefFunction?: (number: number) => number;
}) => {
  const { monkey, monkeys, reliefFunction } = args;

  while (monkey.items.length > 0) {
    // If the current monkey has no items, just skip
    const item = monkey.items.shift();

    if (!item) {
      continue;
    }

    monkey.counter++;

    let currentLevel = monkey.operation(item);

    if (reliefFunction) {
      currentLevel = reliefFunction(currentLevel);
    }

    const nextMonkey = monkey.test(currentLevel);
    const next = monkeys[nextMonkey];

    if (!next) {
      throw new Error("Invalid monkey index " + nextMonkey);
    }
    next.items.push(currentLevel);
  }
};

export const sortByCounter = (monkeys: Monkey[]) =>
  monkeys
    .map((m) => ({ index: m.index, counter: m.counter }))
    .sort((m1, m2) => m2.counter - m1.counter);
