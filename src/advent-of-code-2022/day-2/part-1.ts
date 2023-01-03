import { getRoundOutcome, input } from "./utils";

const total = input.reduce((acc, round) => {
  const [challenger, player] = round.split(" ");
  const [value, result] = getRoundOutcome(challenger, player);
  return acc + value + result;
}, 0);

console.log(total);
