import { Dir } from "fs";
import { get } from "https";
import { groupBy, memoize } from "lodash";
import { getKey } from "./getKey";
import { Tile, Direction } from "./solve";

// Influenced by https://gist.github.com/juj/1f09f475e01949233a2f206a0552425c

function* getCornerDirections(tiles: Map<string, Tile>, tile: Tile) {
  const upperLeft = getKey(tile.column - 1, tile.row - 1);

  if (!tiles.has(upperLeft)) {
    yield [(Direction.Up, Direction.Left)];
  }

  const upperRight = getKey(tile.column - 1, tile.row + 1);

  if (!tiles.has(upperRight)) {
    yield [Direction.Up, Direction.Right];
  }

  const downLeft = getKey(tile.column + 1, tile.row - 1);

  if (!tiles.has(downLeft)) {
    yield [Direction.Down, Direction.Left];
  }

  const downRight = getKey(tile.column + 1, tile.row + 1);

  if (!tiles.has(downRight)) {
    yield [Direction.Down, Direction.Right];
  }
}

const getNext = (direction: Direction) => {
  switch (direction) {
    case Direction.Down:
      return Direction.Up;

    case Direction.Left:
      return Direction.Right;

    case Direction.Right:
      return Direction.Left;

    case Direction.Up:
      return Direction.Down;

    default:
      throw new Error();
  }
};

export const getMovement = memoize((direction: Direction) => {
  let target: "row" | "column";
  let shift: 1 | -1 = 1;

  switch (direction) {
    case Direction.Down: {
      target = "row";
      break;
    }

    case Direction.Up: {
      target = "row";
      shift = -1;
      break;
    }

    case Direction.Right: {
      target = "column";
      break;
    }

    case Direction.Left: {
      target = "column";
      shift = -1;
      break;
    }
  }

  return {
    target,
    shift,
  };
});

export const getCorners = (tiles: Map<string, Tile>) => {
  return Array.from(tiles.entries()).filter(([_, tile]) => {
    const getTile = (column: number, row: number) =>
      tiles.get(getKey(column, row));

    const neighbours = [
      !!getTile(tile.column - 1, tile.row),
      !!getTile(tile.column, tile.row - 1),
      !!getTile(tile.column, tile.row + 1),
      !!getTile(tile.column + 1, tile.row),
    ];
    const isEdge = neighbours.filter(Boolean).length !== 4;

    if (isEdge) {
      return false;
    }

    const directions = Array.from(getCornerDirections(tiles, tile));

    // const upperLeft = getKey(tile.column - 1, tile.row - 1);
    // const upperRight = getKey(tile.column - 1, tile.row + 1);
    // const downLeft = getKey(tile.column + 1, tile.row - 1);
    // const downRight = getKey(tile.column + 1, tile.row + 1);

    // const diagonals = [upperLeft, upperRight, downLeft, downRight].reduce(
    //   (acc, key) => (!tiles.has(key) ? acc + 1 : acc),
    //   0
    // );

    return directions.filter(Boolean).length === 1;
  });
};

export const stitchCube = (tiles: Map<string, Tile>, corners: Tile[]) => {
  const stitches = new Map<string, { tile: Tile; direction: Direction }>();

  const getKey = (tile: Tile, direction: Direction) =>
    `${tile.column}-${tile.row}-${direction}`;

  // For each corner, have two workers. One clock wise, the other counter clock wise
  for (let corner of corners) {
    const [[dirCw, dirCcw]] = Array.from(getCornerDirections(tiles, corner));

    let cwMovement = getMovement(dirCw);
    let ccwMovement = getMovement(dirCcw);

    let cw = corner;
    let ccw = corner;

    // For both direction
    //

    //     while (true) {
    //       let nextCw = corner[cwMovement.next];
    //       let nextCcw = corner[ccwMovement.next];

    //       if (nextCw && nextCcw) {
    //         cw = nextCw;
    //         ccw = nextCcw;

    //         let key = getKey(nextCw, dirCcw);
    //         stitches.set(key, {
    //           tile: ccw,
    //           direction: cwMovement.oppositeNext,
    //         });

    //         continue;
    //       }

    //       cw = corner[cwMovement.next];
    //       ccw = corner[ccwMovement.next];

    //       let nextCwDir = dirCw;
    //       let nextCcWDir = dirCcw;
    //     }
  }
};

// export const getOnOutOfBounds = (
//   tiles: Map<string, Tile>,
//   faceSize: number
// ) => {
//   const tilesByCube = groupBy([...tiles.values()], "cube");

//   const onOutOfBounds = (
//     tile: Tile,
//     direction: Direction
//   ): [Tile, Direction] => {
//     if (!tile) {
//       throw new Error("Invalid tile");
//     }

//     return undefined;
//   };

//   return onOutOfBounds;
// };
