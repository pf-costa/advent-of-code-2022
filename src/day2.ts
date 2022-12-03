import { debug } from "console";
import { readInput } from "./utils";

// Order of the arrays
// - Rock
// - Paper
// - Scissors
const items = Object.freeze(["A", "B", "C"]);
const choices = Object.freeze(["X", "Y", "Z"]);

enum Result {
  Loss = 0,
  Draw = 3,
  Victory = 6,
}

const txt = readInput(2);

const getRoundOutcome = (challenger: string, player: string) => {
  const index1 = items.indexOf(challenger);
  const index2 = choices.indexOf(player);

  // By default consider a draw
  let result = Result.Draw;

  if (index1 !== index2) {
    // Rock paper scissor has a circular structure
    // i.e. Rock -> Paper -> Scissor --> (back to Rock)
    const diff = index1 - index2;

    result =
      diff === -1 || diff === choices.length - 1 ? Result.Victory : Result.Loss;
  }

  // Value of the choice
  const value = index2 + 1;

  return [value, result];
};

const total = txt.reduce((acc, round) => {
  const [challenger, player] = round.split(" ");
  const [value, result] = getRoundOutcome(challenger, player);
  return acc + value + result;
}, 0);

console.log(total);
