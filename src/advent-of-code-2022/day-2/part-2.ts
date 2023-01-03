import { choices, getRoundOutcome, input, items } from "./utils";
import assert from "node:assert/strict";

enum Outcome {
  Lose = "X",
  Draw = "Y",
  Win = "Z",
}

const decryptData = (challenger: string, data: string) => {
  let index1 = items.indexOf(challenger);

  switch (data) {
    case Outcome.Lose: {
      index1--;
      let target = index1 < 0 ? items.length - 1 : index1;
      return choices[target];
    }

    default:
    case Outcome.Draw:
      return choices[index1];

    case Outcome.Win:
      index1++;
      let target = index1 >= items.length ? 0 : index1;
      return choices[target];
  }
};

const total = input.reduce((acc, round) => {
  const [challenger, data] = round.split(" ");

  // Normalize the data
  const player = decryptData(challenger, data);

  const [value, result] = getRoundOutcome(challenger, player);
  return acc + value + result;
}, 0);

assert.equal(decryptData("A", "X"), "Z");
assert.equal(decryptData("A", "Y"), "X");
assert.equal(decryptData("A", "Z"), "Y");

assert.equal(decryptData("B", "X"), "X");
assert.equal(decryptData("B", "Y"), "Y");
assert.equal(decryptData("B", "Z"), "Z");

console.log(total);
