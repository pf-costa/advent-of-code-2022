import { overSome } from "lodash";
import { input } from "../day-2/utils";
import { getColumn, getTrees } from "./utils";

const trees = getTrees();

const totalRows = input.length;
const totalColumns = input[0].length;

type Tree = {
  row: number;
  column: number;
  value: number;
};

const isVisibleWithNeighbours = (tree: Tree, neighbours: number[]) => {
  return neighbours.every((n) => n < tree.value);
};

const isVisibleFromTop = (tree: Tree) => {
  const column = getColumn(trees, tree.column);

  return isVisibleWithNeighbours(tree, column.slice(0, tree.row));
};

const isVisibleFromBottom = (tree: Tree) => {
  const column = getColumn(trees, tree.column);

  return isVisibleWithNeighbours(tree, column.slice(tree.row + 1));
};

const isVisibleFromLeft = (tree: Tree) => {
  const row = trees[tree.row];

  return isVisibleWithNeighbours(tree, row.slice(0, tree.column));
};

const isVisibleFromRight = (tree: Tree) => {
  const row = trees[tree.row];

  return isVisibleWithNeighbours(tree, row.slice(tree.column + 1));
};

const isVisible = overSome(
  isVisibleFromBottom,
  isVisibleFromTop,
  isVisibleFromLeft,
  isVisibleFromRight
);

const getVisibleTrees = () => {
  let visible = (totalRows - 2) * 2 + 2 * totalColumns;

  for (let row = 1; row < totalRows - 1; row++) {
    for (let column = 1; column < totalRows - 1; column++) {
      const tree: Tree = {
        row,
        column,
        value: trees[row][column],
      };

      if (isVisible(tree)) {
        visible++;
      }
    }
  }

  return visible;
};

console.log(getVisibleTrees());
