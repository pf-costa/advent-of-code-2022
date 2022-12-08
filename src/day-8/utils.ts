import { memoize, values } from "lodash";
import { readInput } from "../utils";

export type Tree = {
  row: number;
  column: number;
  value: number;
};

export const getTrees = () => {
  const input = readInput(8);
  const trees: Array<Array<number>> = [];

  input.forEach((line) => {
    const columns: Array<number> = [];

    for (let index = 0; index < line.length; index++) {
      columns.push(+line[index]);
    }

    trees.push(columns);
  });

  return trees;
};

export const getColumn = memoize(
  (trees: Array<Array<number>>, index) => {
    return trees.reduce(
      (acc, line) => acc.concat(+line[index]),
      [] as Array<number>
    );
  },
  (...args) => {
    return args[1].toString();
  }
);
