import { readInput, toChunks } from "./utils";

const getCompartments = (rucksack: string) => {
  const half = Math.round(rucksack.length / 2);
  return [rucksack.slice(0, half), rucksack.slice(half)];
};

const getCommonItem = (...compartments: string[]) => {
  const [first, ...others] = compartments.sort((a, b) => b.length - a.length);

  return Array.from(first).find((c) => others.every((o) => o.includes(c)));
};

const getPriority = (item: string | undefined) => {
  if (!item) {
    // Should never happen
    throw new Error("Invalid item");
  }

  const ascii = item.charCodeAt(0);
  const delta = ascii >= 97 ? 96 : 38;

  return ascii - delta;
};

const input = readInput(3);

// Challenge 1
const total = input.reduce((acc, rucksack) => {
  const [compartment1, compartment2] = getCompartments(rucksack);
  const commonItem = getCommonItem(compartment1, compartment2);
  const priority = getPriority(commonItem);

  return acc + priority;
}, 0);

// Challenge 2
const total2 = toChunks(input, 3).reduce((acc, chunk) => {
  const commonItem = getCommonItem(...chunk);
  const priority = getPriority(commonItem);

  return acc + priority;
}, 0);

console.log(total, total2);
