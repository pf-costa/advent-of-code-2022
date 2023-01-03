import { max, min } from "lodash";
import readInput from "../utils/readInput";
import ansi from "ansi";
const cursor = ansi(process.stdout);
cursor.queryPosition();

export type Coord = { x: number; y: number };
type Shape = Array<Coord>;
export type Board = Array<Array<string>>;

export const chars = Object.freeze({
  sand: "o",
  pouringPoint: "+",
  void: ".",
  shape: "#",
});

export const getBoard = (withFooter = false) => {
  const input = readInput(14);

  let shapes: Shape[] = input.map((l) =>
    l.split(" -> ").map((coor) => {
      const [c1, c2] = coor.split(",");
      // On purpose
      return { x: +c1, y: +c2 };
    })
  );

  let allCoords = shapes.flatMap((s) => s.flatMap((c) => c));
  const minX = min(allCoords.flatMap((s) => s.x)) as number;
  let maxX = max(allCoords.flatMap((s) => s.x)) as number;
  let maxY = max(allCoords.flatMap((s) => s.y)) as number;

  // Add a padding in order to allow to see the sand drop from the shapes
  const padding = 50000;

  // Normalize the data (Just for X)
  const normalizeCoordinate = ({ x, y }: Coord): Coord => {
    return { x: x - minX + padding, y: y };
  };

  shapes = shapes.map((s) => s.map(normalizeCoordinate));

  const pouringPoint: Coord = normalizeCoordinate({ x: 500, y: 0 });

  allCoords = shapes.flatMap((s) => s.flatMap((c) => c));
  maxX = max(allCoords.flatMap((s) => s.x)) as number;

  if (withFooter) {
    maxY += 2;

    shapes.push([
      { x: 0, y: maxY },
      { x: maxX + 1 + padding, y: maxY },
    ]);
  }

  const board: Board = Array.from(new Array(maxY + 2)).map((a) =>
    Array.from(new Array(maxX + 2 + padding).fill(chars.void))
  );

  // Pouring point
  board[pouringPoint.y][pouringPoint.x] = chars.pouringPoint;

  // Insert shapes
  shapes.forEach((s) => {
    for (let i = 0; i < s.length - 1; i++) {
      const { x: x1, y: y1 } = s[i];
      const { x: x2, y: y2 } = s[i + 1];

      const [fromX, toX] = x1 < x2 ? [x1, x2] : [x2, x1];
      const [fromY, toY] = y1 < y2 ? [y1, y2] : [y2, y1];

      for (let diff = fromX; diff <= toX; diff++) {
        board[y1][diff] = chars.shape;
      }

      for (let diff = fromY; diff <= toY; diff++) {
        board[diff][x1] = chars.shape;
      }
    }
  });

  return { board, pouringPoint };
};

export function* processSand(board: Board, sand: Coord) {
  const positions = [
    // down
    [0, 1],
    // left
    [-1, 1],
    // Down Right
    [0, 1],
    // Down Right
    [1, 1],
  ];

  const move = () => {
    const { x, y } = sand;

    for (let index = 0; index < positions.length; index++) {
      let [xPos, yPos] = positions[index];

      const nextX = x + xPos;
      const nextY = y + yPos;

      const next = board[nextY]?.[nextX];

      // Are we out of bounds?
      if (next === undefined && index === 0) {
        return undefined;
      }

      if (next !== chars.void) {
        continue;
      }

      return {
        x: nextX,
        y: nextY,
      };
    }

    // Couldn't move to any other position
    return {
      x,
      y,
    };
  };

  while (true) {
    let next = move();

    // Out of bounds
    if (!next) {
      return next;
    }

    // Rested state
    if (sand.x === next.x && sand.y === next.y) {
      return next;
    }

    sand = next;
    yield next;
  }
}

export const drawBoard = (board: Board, sand: Coord) => {
  const drawing = board
    .map((r, rowIndex) =>
      r
        .map((c, columnIndex) => {
          if (sand?.x === columnIndex && rowIndex === sand?.y) {
            return chars.sand;
          }

          return c;
        })
        .join("")
    )
    .join("\n");

  cursor.eraseData();
  cursor.goto(0, 0);
  cursor.write(drawing);
};

export const processBoard = async (
  board: Board,
  pouringPoint: Coord,
  withAnimation = false
) => {
  let processor: ReturnType<typeof processSand> | undefined = undefined;

  const firstSand = {
    x: pouringPoint.x,
    y: pouringPoint.y,
  };

  let restedSand = 0;

  return new Promise((res) => {
    while (true) {
      if (!processor) {
        processor = processSand(board, firstSand);
      }

      const { value: sand, done } = processor.next();

      if (done) {
        if (sand) {
          const { x, y } = sand;
          restedSand++;

          if (x === firstSand.x && y === firstSand.y) {
            // Piece is no longer able to move
            //   clearInterval(interval);
            res(restedSand);
            return;
          }

          board[y][x] = chars.sand;
        } else {
          // clearInterval(interval);
          res(restedSand);
          return;
        }

        processor = processSand(board, firstSand);

        if (withAnimation) {
          drawBoard(board, sand as Coord);
        }
      }
    }

    //     const interval = setInterval(
    //       () => {
    //         if (!processor) {
    //           processor = processSand(board, firstSand);
    //         }

    //         const { value: sand, done } = processor.next();

    //         if (done) {
    //           if (sand) {
    //             const { x, y } = sand;
    //             restedSand++;

    //             if (x === firstSand.x && y === firstSand.y) {
    //               // Piece is no longer able to move
    //               clearInterval(interval);
    //               res(restedSand);
    //               return;
    //             }

    //             board[y][x] = chars.sand;
    //           } else {
    //             clearInterval(interval);
    //             res(restedSand);
    //             return;
    //           }

    //           processor = processSand(board, firstSand);

    //           if (withAnimation) {
    //             drawBoard(board, sand as Coord);
    //           }
    //         }
    //       },
    //       withAnimation ? 1 : 0
    //     );
    // //   });
  });
};
