import fs from "fs";
import path from "path";

export const toChunks = <T>(array: Array<T>, size: number) =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(array.slice(i, i + size));
    }
    return acc;
  }, [] as Array<Array<T>>);

export const readInput = (day: number) =>
  fs
    .readFileSync(path.resolve(__dirname, `../inputs/input-${day}.txt`))
    .toString()
    .split("\n");
