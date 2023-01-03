import readInput from "../utils/readInput";
import { getMonkeys, Monkey, processMonkey, sortByCounter } from "./utils";

let input = readInput(11);
const monkeys = getMonkeys(input);

const solve = (
  reliefFunction: (value: number) => number,
  monkeys: Monkey[],
  rounds: number
) => {
  for (let round = 0; round < rounds; round++) {
    for (let monkey of monkeys) {
      processMonkey({ monkey, monkeys, reliefFunction });
    }
  }
};

const denominator = monkeys.map((m) => m.divisor).reduce((acc, m) => acc * m);

solve((v) => v % denominator, monkeys, 10000);
const sortedMonkeys = sortByCounter(monkeys).map((m) => m.counter);

console.log(sortedMonkeys[0] * sortedMonkeys[1]);
