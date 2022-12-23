import readInput from "./utils/readInput";
import ansi from "ansi";
import { max } from "lodash";
const cursor = ansi(process.stdout);
cursor.queryPosition();
import execute from "./utils/execute";

enum Direction {
  Left = "<",
  Right = ">",
  Down = "-",
}

enum Chars {
  Void = ".",
  Moving = "@",
  Resting = "#",
}

const line: number[][] = [new Array(4).fill(1)];

const cross = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const lshape = [
  [0, 0, 1],
  [0, 0, 1],
  [1, 1, 1],
].reverse();

const column = [[1], [1], [1], [1]];

const square = [
  [1, 1],
  [1, 1],
];

const patterns = [line, cross, lshape, column, square];
const jetPattern = readInput(17)[0] as any as Direction[];

type PileItem = {
  x: number;
  y: number;
  pattern: number[][];
};

const boardWidth = 7;

function mergeWithBoard(item: PileItem, board: Array<Array<number>>) {
  // From the current position and pattern
  // Check if the in board we collide with any place
  for (let lineIndex = 0; lineIndex < item.pattern.length; lineIndex++) {
    let x = item.x;
    let y = item.y + lineIndex;
    let line = item.pattern[lineIndex];

    for (let index = 0; index < line.length; index++) {
      if (board[y] === undefined) {
        board[y] = new Array(boardWidth).fill(0);
      }

      board[y][x + index] = board[y][x + index] || line[index];
    }
  }
}

function checkCollision(item: PileItem, board: Array<Array<number>>) {
  // From the current position and pattern
  // Check if the in board we collide with any place
  for (let lineIndex = 0; lineIndex < item.pattern.length; lineIndex++) {
    let x = item.x;
    let y = item.y + lineIndex;
    let line = item.pattern[lineIndex];

    for (let index = 0; index < line.length; index++) {
      if (board[y] === undefined) {
        continue;
      }

      if (board[y][x + index] === 1 && line[index] === 1) {
        return true;
      }
    }
  }

  return false;
}

function moveRock(
  item: PileItem,
  board: Array<Array<number>>,
  direction: Direction
) {
  let newItem = { ...item };

  if (direction === Direction.Left) {
    newItem.x--;
    if (newItem.x < 0 || checkCollision(newItem, board)) {
      newItem.x++;
    }
  }

  if (direction === Direction.Right) {
    newItem.x++;
    const itemWith = newItem.pattern[0].length;

    if (newItem.x + itemWith > boardWidth || checkCollision(newItem, board)) {
      newItem.x--;
    }
  }

  if (direction === Direction.Down) {
    newItem.y--;
    if (newItem.y < 0 || checkCollision(newItem, board)) {
      newItem.y++;
    }
  }

  return newItem;
}

const getHighestRock = (board: Array<Array<number>>) => {
  if (board.length === 0) {
    return 0;
  }

  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i].some((c) => c === 1)) {
      return i + 1;
    }
  }

  return 0;
};

function* processBoard(rocks = 2022) {
  const board: Array<Array<number>> = [];

  // Rested pieces
  let jetIndex = 0;
  let patternIndex = 0;
  let previous: PileItem | undefined = undefined;

  for (let rockIndex = 0; rockIndex < rocks; rockIndex++) {
    const y = getHighestRock(board);

    let item: PileItem = {
      x: 2,
      y: y + 3,
      pattern: patterns[patternIndex],
    };

    let next = item;

    let jet = jetPattern[jetIndex] as any as Direction;
    yield { board, item: next, jet: "" };

    // While the rock is not rested
    while (true) {
      if (jetIndex === jetPattern.length) {
        jetIndex = 0;
      }

      jet = jetPattern[jetIndex] as any as Direction;

      next = moveRock(item, board, jet);
      yield { board, item: next, jet };
      jetIndex++;

      next = moveRock(next, board, Direction.Down);

      if (next.y === item.y) {
        mergeWithBoard(next, board);
        yield { board, item: undefined, jet: "" };
        break;
      }

      yield { board, item: next, jet: "" };
      item = next;
    }

    previous = item;
    patternIndex++;

    if (patternIndex === patterns.length) {
      patternIndex = 0;
    }
  }

  return { board, item: undefined, jet: jetPattern[jetIndex] };
}

const b: Array<Array<number>> = [];

mergeWithBoard({ x: 3, y: 0, pattern: cross }, b);
let n = moveRock({ x: 0, y: 0, pattern: lshape }, b, Direction.Right);

console.table(b.reverse());

const input2 = readInput(18).map((l) => +l);

(async () => {
  const processor = processBoard();
  const floor = `+${new Array(boardWidth).fill("-").join("")}+`;
  let tick = 0;
  let boardHeight = 0;
  const withAnimation = false;
  let complete = 0;

  execute((stop) => {
    const { value, done } = processor.next();

    tick++;

    if (done) {
      const r = value.board.length;
      console.log(r);
      stop();
      return;
    }

    const { board, item, jet } = value;

    if (!item) {
      //   assert.equal(board.length, input2[complete]);
      complete++;
    }

    if (!withAnimation) {
      return;
    }

    let drawing: string[] = [];

    const itemHeight = item ? item.pattern.length : 0;

    const maxY = max([item ? item.y + itemHeight : 0, board.length]) as number;
    boardHeight = max([boardHeight, board.length]) as number;

    for (let y = 0; y < maxY; y++) {
      let boardLine = board[y] || new Array(boardWidth).fill(0);

      const line = boardLine.map((l, x) => {
        if (item) {
          let itemY = y - item.y;
          let itemX = x - item.x;

          if (item.pattern[itemY]?.[itemX]) {
            return Chars.Moving;
          }
        }

        return l === 1 ? Chars.Resting : Chars.Void;
      });

      drawing.push(`|${line.join("")}|`);
    }

    drawing = drawing.reverse().slice(drawing.length - 200);
    drawing.push(floor);
    drawing.push("Jet " + jet);
    drawing.push("Tick " + tick);
    drawing.push("\n\n");

    console.clear();

    cursor.eraseData();
    cursor.goto(0, 0);
    cursor.write(drawing.join("\n"));
  }, 0);
})();
