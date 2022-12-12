// Order of the arrays
// - Rock
// - Paper

import { readInput } from "../utils/readInput";

// - Scissors
export const items = Object.freeze(["A", "B", "C"]);
export const choices = Object.freeze(["X", "Y", "Z"]);

enum Result {
  Loss = 0,
  Draw = 3,
  Victory = 6,
}

export const input = readInput(2);

export const getRoundOutcome = (challenger: string, player: string) => {
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
