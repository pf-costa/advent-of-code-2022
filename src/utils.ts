import fs from "fs";
import path from "path";

export const readInput = (day: number) =>
  fs
    .readFileSync(path.resolve(__dirname, `../inputs/input-${day}.txt`))
    .toString()
    .split("\n");
