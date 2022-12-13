import readInput from "./utils/readInput";
import assert from "node:assert";

const input = readInput(13);

type Item = number | Array<number> | Array<Item>;

export const getPairs = (input: string[]) => {
  const pairs: [Item, Item][] = [];

  const getItem = (i: string) => JSON.parse(i) as Item;

  while (input.length > 0) {
    const index = input.findIndex((i) => i == "");

    // Get the lines that represent a monkey's instructions
    const items = input.slice(0, index === -1 ? undefined : index);

    pairs.push([getItem(items[0]), getItem(items[1])]);

    // Stop conditions
    if (index === -1) {
      break;
    }

    input = input.slice(index + 1);
  }

  return pairs;
};

const toArray = (item: Item) => {
  if (Array.isArray(item)) {
    return item;
  }

  return [item];
};

const compare = (...items: Item[]): boolean | undefined => {
  const [item1, item2] = items;
  const areArrays = Array.isArray(item1) && Array.isArray(item2);

  if (!areArrays) {
    return compare(toArray(item1), toArray(item2));
  }

  const max = Math.max(item1.length, item2.length);

  for (let i = 0; i < max; i++) {
    const left = item1[i];
    const right = item2[i];

    // Left side ran out of items, so inputs are in the right order
    if (left === undefined) {
      return true;
    }

    // Right side ran out of items, so inputs are not in the right order
    if (right === undefined) {
      return false;
    }

    const areNumbers = typeof left === "number" && typeof right === "number";

    if (!areNumbers) {
      const areEqual = compare(left, right);

      if (areEqual === undefined) {
        continue;
      }

      return areEqual;
    }

    if (left === right) {
      continue;
    }

    return left < right;
  }

  return undefined;
};

const pairs = getPairs(input);

// For example input file
const assertions = [true, true, false, true, false, true, false, false];

// const index = 1;
// assert.equal(assertions[index], compare(...pairs[index]));

// pairs.forEach((p, i) => {
//   if (assertions[i] !== compare(...p)) {
//     throw new Error("Invalid index " + i);
//   }
// });

// Part 1
const result = pairs.reduce((acc, p, index) => {
  const isValid = compare(...p);

  return isValid ? acc + index + 1 : acc;
}, 0);

console.log(result);

const divider1: Item = [[2]];
const divider2: Item = [[6]];

const flat = pairs.flatMap((p) => [...p]);
flat.push(divider1);
flat.push(divider2);

const sorted = flat.sort((p1, p2) => {
  return compare(p1, p2) ? -1 : 1;
});

const total = (sorted.indexOf(divider1) + 1) * (sorted.indexOf(divider2) + 1);

console.log(total);
