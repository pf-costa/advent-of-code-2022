import { readInput } from "../utils/readInput";
import { getMonkeys, processMonkey, sortByCounter } from "./utils";

let input = readInput(11);
const monkeys = getMonkeys(input);

const reliefFunction = (number: number) => Math.floor(number / 3);

for (let round = 0; round < 20; round++) {
  for (let monkey of monkeys) {
    processMonkey({ monkey, monkeys, reliefFunction });
  }
}

const sortedMonkeys = sortByCounter(monkeys);

const m = sortedMonkeys.map((m) => ({ i: m.index, counter: m.counter }));

console.table(m);
