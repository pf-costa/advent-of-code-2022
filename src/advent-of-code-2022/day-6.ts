import readInput from "./utils/readInput";

// Just one line
const input = readInput(6)[0];

let index = 0;

// Part 1 - 4
// Part 2
const numberLetters = 14;

do {
  const chunk = input.substring(index, index + numberLetters);

  const set = new Set<string>();
  set.add(chunk[0]);

  for (let i = 1; i < chunk.length; i++) {
    const letter = chunk[i];

    if (set.has(letter)) {
      index += i;
      break;
    }

    set.add(letter);
  }

  if (set.size === numberLetters) {
    console.log("index", index + numberLetters - 1, chunk);
    break;
  }
} while (index < input.length);

console.log("cenas");
