import { getColumn, getTrees, Tree } from "./utils";

const trees = getTrees();
const totalRows = trees.length;
const totalColumns = trees[0].length;

const getScenicScoreFor = (tree: Tree, items: number[]) => {
  let score = 0;

  for (let item of items) {
    score++;

    if (item >= tree.value) {
      break;
    }
  }

  return score;
};

const getScenicScoreForLeft = (tree: Tree) => {
  const row = trees[tree.row];
  const items = row.slice(0, tree.column).reverse();

  return getScenicScoreFor(tree, items);
};

const getScenicScoreForRight = (tree: Tree) => {
  const row = trees[tree.row];
  const items = row.slice(tree.column + 1);

  return getScenicScoreFor(tree, items);
};

const getScenicScoreForTop = (tree: Tree) => {
  const column = getColumn(trees, tree.column);
  const items = column.slice(0, tree.row).reverse();

  return getScenicScoreFor(tree, items);
};

const getScenicScoreForBottom = (tree: Tree) => {
  const column = getColumn(trees, tree.column);
  const items = column.slice(tree.row + 1);

  return getScenicScoreFor(tree, items);
};

const getScenicScore = (tree: Tree) => {
  const bottom = getScenicScoreForBottom(tree);
  const top = getScenicScoreForTop(tree);
  const left = getScenicScoreForLeft(tree);
  const right = getScenicScoreForRight(tree);

  return left * top * right * bottom;
};

const getMaxScenicScore = () => {
  let maxScore = 0;

  // Ignore edges since the scenic score will always be 0
  for (let row = 1; row < totalRows - 1; row++) {
    for (let column = 1; column < totalColumns - 1; column++) {
      const tree: Tree = {
        row,
        column,
        value: trees[row][column],
      };

      const score = getScenicScore(tree);

      if (score > maxScore) {
        maxScore = score;
      }
    }
  }

  return maxScore;
};

const s = getMaxScenicScore();
console.log(s);
