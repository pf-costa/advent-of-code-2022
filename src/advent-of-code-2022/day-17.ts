import readInput from "./utils/readInput";
import ansi from "ansi";
import { last, max } from "lodash";
const cursor = ansi(process.stdout);
cursor.queryPosition();
import execute from "./utils/execute";

type Board = Array<Array<number>>;

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

function mergeWithBoard(item: PileItem, board: Board) {
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

function checkCollision(item: PileItem, board: Board) {
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

function moveRock(item: PileItem, board: Board, direction: Direction) {
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

const getHighestRock = (board: Board) => {
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

type Pattern = {
  heights: number[];
  rockIndexes: number[];
};

function* processBoard(
  rocks = 2022,
  jetIndex = 0,
  patternIndex = 0,
  board: Board = []
) {
  let purgedItems = 0;
  const patternRepetitions = 10;
  let previous;

  // For every fixed size input, there shall be a point where a pattern emerges
  // Store all the combinations
  const repetitions = new Map<string, Pattern>();

  const addEntry = (rockIndex: number) => {
    // Get the integer value from the line
    const line = board[board.length - 1].reduce((acc, val) => {
      return (acc << 1) | val;
    }, 0);

    const key = `${patternIndex}-${jetIndex}-${line}`;
    const entry = repetitions.get(key);

    if (!entry) {
      repetitions.set(key, {
        heights: [board.length],
        rockIndexes: [rockIndex],
      });
      return false;
    }

    // If we are starting to have a 3rd repeated pattern
    // We can safely assume that the rest of the sequence is going to be the same
    if (entry.heights.length === patternRepetitions) {
      return true;
    }

    entry.heights.push(board.length);
    entry.rockIndexes.push(rockIndex);

    return false;
  };

  const getBoardHeight = () => {
    const pattern = Array.from(repetitions.entries()).filter(
      (e) => e[1].heights.length === patternRepetitions
    );

    const all = Array.from(repetitions.entries())
      .filter((e) => e[1].heights.length !== patternRepetitions)
      .flatMap((e) => e[1].heights);

    if (pattern.length === 0) {
      return board.length;
    }

    const { heights, rockIndexes } = pattern.at(0)?.[1];
    const patternSize = heights[1] - heights[0];

    const neededRocks = rockIndexes[1] - rockIndexes[0];
    const initialRocks = rockIndexes[0] - 1;

    const groups = Math.floor((rocks - initialRocks) / neededRocks);
    let height = groups * patternSize + heights[0];

    const rest = (rocks - initialRocks) % neededRocks;

    if (rest > 0) {
      let newBoard = board.slice(board.length - patternSize);

      // Process remaining rocks
      let entry = last(
        Array.from(processBoard(rest, jetIndex, patternIndex, newBoard))
      );

      height += entry.board.length - patternSize;
    }

    return height;
  };

  for (let rockIndex = 0; rockIndex < rocks; rockIndex++) {
    const y = getHighestRock(board);

    let item: PileItem = {
      x: 2,
      y: y + purgedItems + 3,
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

        if (addEntry(rockIndex)) {
          const boardHeight = getBoardHeight();

          return {
            boardHeight: boardHeight,
          };
        }

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

  const boardHeight = getBoardHeight();

  return {
    boardHeight,
  };
}

(async () => {
  const rocks = 1_000_000_000_000;
  const processor = processBoard(rocks);
  const floor = `+${new Array(boardWidth).fill("-").join("")}+`;
  let tick = 0;
  let boardHeight = 0;
  const animationInterval = 0;
  let complete = 0;

  execute((stop) => {
    const { value, done } = processor.next();

    tick++;

    if (done) {
      console.log(value.boardHeight);

      stop();
      return;
    }

    const { board, item, jet } = value as any;

    if (!animationInterval) {
      return;
    }

    if (!item) {
      complete++;
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

      drawing.push(`|${line.join("")}| ${y}`);
    }

    drawing = drawing.reverse();
    drawing.push(floor);
    drawing.push("Jet " + jet);
    drawing.push("Tick " + tick);
    drawing.push("\n\n");

    cursor.eraseData();
    cursor.goto(0, 0);
    cursor.write(drawing.join("\n"));
  }, animationInterval);
})();
