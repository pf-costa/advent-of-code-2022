import fs from "fs";
import path from "path";

const readInput = (day: number, example = false) =>
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        `../../../inputs/input-${day}${example ? "-example" : ""}.txt`
      )
    )
    .toString()
    .split("\n");

export default readInput;
