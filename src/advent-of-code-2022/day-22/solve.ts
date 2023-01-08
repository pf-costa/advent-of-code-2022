import { getData } from "./getData";
import { getKey } from "./getKey";
import { getMovement } from "./getOnOutOfBounds";
export type CubeFace = 1 | 2 | 3 | 4 | 5 | 6;

export type Tile = {
  column: number;
  row: number;
  isWall: boolean;
  cube?: CubeFace;
};

export enum Direction {
  Right = 0,
  Down = 1,
  Left = 2,
  Up = 3,
}

const directions = [
  Direction.Right,
  Direction.Down,
  Direction.Left,
  Direction.Up,
];

export type Player = {
  column: number;
  row: number;
  direction: Direction;
};

const rotate = (player: Player, to: string) => {
  const index = to === "R" ? 1 : -1;

  let next = player.direction + index;

  if (next < 0) {
    next = directions.length - 1;
  }

  next %= directions.length;

  player.direction = directions[next];
};

export function* process(
  player: Player,
  tiles: Map<string, Tile>,
  instructions: (string | number)[],
  onOutOfBounds: (tile: Tile, direction: Direction) => [Tile, Direction]
) {
  function* move(amount: number) {
    let next = {
      column: player.column,
      row: player.row,
    };

    let direction = player.direction;
    let { target, shift } = getMovement(player.direction);

    for (let i = 0; i < amount; i++) {
      next[target] = next[target] + shift;
      let nextTile = tiles.get(getKey(next.column, next.row));

      if (nextTile) {
        if (nextTile.isWall) {
          // Cannot move
          break;
        }

        player.column = next.column;
        player.row = next.row;

        yield { ...player };
        continue;
      }

      // We have reached a boundary
      // Go back to the previous
      next[target] = next[target] - shift;
      let boundary = tiles.get(getKey(next.column, next.row));

      [boundary, direction] = onOutOfBounds(boundary, player.direction);

      // while (boundary[oppositeDir]) {
      //   boundary = boundary[oppositeDir];
      // }

      // if (
      //   nextboundary.row !== boundary.row &&
      //   nextboundary.column !== nextboundary.column
      // ) {
      //   debugger;
      // }
      // if (nextboundary[target] !== boundary[target]) {
      //   debugger;
      // }

      // if (boundary.isWall) {
      //   if (!nextboundary.isWall) debugger;

      //   return;
      // }

      next.row = boundary.row;
      next.column = boundary.column;

      next[target] = boundary[target];

      player.column = next.column;
      player.row = next.row;
      player.direction = direction;

      yield { ...player };
    }
  }

  for (let inst of instructions) {
    yield { instruction: inst };

    if (typeof inst === "string") {
      rotate(player, inst);
      yield { player };
      continue;
    }

    for (let next of move(inst)) {
      yield { player: next };
    }
  }
}

export const getOnOutOfBounds1 = (tiles: Map<string, Tile>) => {
  const onOutOfBounds = (
    tile: Tile,
    direction: Direction
  ): [Tile, Direction] => {
    const oppositeDir = getOppositeDirection(direction);
    const { target, shift } = getMovement(oppositeDir);

    let current = { ...tile };

    while (true) {
      let next = { ...current, [target]: current[target] + shift };
      next = tiles.get(getKey(current.column, current.row));

      if (!next) {
        break;
      }

      current = next;
    }

    return [current, direction];
  };

  return onOutOfBounds;
};

export const solve = (lines: string[]) => {
  const { instructions, tiles, player } = getData(lines);

  Array.from(process(player, tiles, instructions, getOnOutOfBounds1(tiles)));

  return (player.row + 1) * 1000 + 4 * (player.column + 1) + player.direction;
};

const getOppositeDirection = (direction: Direction) => {
  switch (direction) {
    case Direction.Up: {
      return Direction.Down;
    }

    case Direction.Down: {
      return Direction.Up;
    }

    case Direction.Left: {
      return Direction.Right;
    }

    case Direction.Right: {
      return Direction.Left;
    }

    default:
      throw new Error("Invalid direction");
  }
};

export const solve2 = (lines: string[], faceSize: number) => {
  const { instructions, tiles, player } = getData(lines, faceSize);
  // const onOutOfBounds = getOnOutOfBounds(tiles, faceSize);

  Array.from(process(player, tiles, instructions, undefined));

  return (player.row + 1) * 1000 + 4 * (player.column + 1) + player.direction;
};

export default solve;
