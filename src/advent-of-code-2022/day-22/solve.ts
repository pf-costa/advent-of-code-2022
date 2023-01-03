// import assert from "assert";

export type Tile = {
  column: number;
  row: number;
  isWall: boolean;
  top?: Tile;
  right?: Tile;
  down?: Tile;
  left?: Tile;
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

const getKey = (column: number, row: number) => column + "-" + row;

const rotate = (player: Player, to: string) => {
  const index = to === "R" ? 1 : -1;

  let next = player.direction + index;

  if (next < 0) {
    next = directions.length - 1;
  }

  next %= directions.length;

  player.direction = directions[next];
};

const getTiles = (lines: string[]) => {
  const tiles = new Map<string, Tile>();

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];

    for (let column = 0; column < line.length; column++) {
      const item = line[column];

      if (item === " ") {
        continue;
      }

      tiles.set(getKey(column, row), {
        column,
        row,
        isWall: item === "#",
      });
    }
  }

  for (let [_, tile] of tiles) {
    const { column, row } = tile;

    tile.top = tiles.get(getKey(column, row - 1));
    tile.down = tiles.get(getKey(column, row + 1));
    tile.left = tiles.get(getKey(column - 1, row));
    tile.right = tiles.get(getKey(column + 1, row));
  }

  return tiles;
};

const getInstructions = (line: string) => {
  return Array.from(line.matchAll(/(\d+)|(R|L)/g)).map(([l]) =>
    isNaN(+l) ? l : +l
  );
};

export const getData = (lines: string[]) => {
  const mapLines = lines.slice(0, lines.length - 2);
  const tiles = getTiles(mapLines);

  const instructions = getInstructions(lines[lines.length - 1]);
  const [column, row] = Array.from(tiles.keys())[0].split("-");

  let player = {
    direction: Direction.Right,
    column: +column,
    row: +row,
  };

  return {
    tiles,
    instructions,
    column: +column,
    row: +row,
    player,
  };
};

export function* process(
  player: Player,
  tiles: Map<string, Tile>,
  instructions: (string | number)[]
) {
  function* move(amount: number) {
    let next = {
      column: player.column,
      row: player.row,
    };

    let target: keyof typeof next;
    let shift: 1 | -1 = 1;
    let oppositeDir: keyof Tile;

    switch (player.direction) {
      case Direction.Down: {
        target = "row";
        oppositeDir = "top";
        break;
      }

      case Direction.Up: {
        target = "row";
        shift = -1;
        oppositeDir = "down";
        break;
      }

      case Direction.Right: {
        target = "column";
        oppositeDir = "left";
        break;
      }

      case Direction.Left: {
        target = "column";
        shift = -1;
        oppositeDir = "right";
        break;
      }
    }

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

      while (boundary[oppositeDir]) {
        boundary = boundary[oppositeDir];
      }

      if (boundary.isWall) {
        return;
      }

      next[target] = boundary[target];
      player.column = next.column;
      player.row = next.row;

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

export const solve = (lines: string[]) => {
  const { instructions, tiles, player } = getData(lines);

  Array.from(process(player, tiles, instructions));

  return (player.row + 1) * 1000 + 4 * (player.column + 1) + player.direction;
};

let player: Player = {
  column: 0,
  row: 0,
  direction: Direction.Right,
};

// rotate(player, "L");
// assert.equal(player.direction, Direction.Up);
// rotate(player, "L");
// assert.equal(player.direction, Direction.Left);
// rotate(player, "L");
// assert.equal(player.direction, Direction.Down);
// rotate(player, "R");
// assert.equal(player.direction, Direction.Left);
// rotate(player, "R");
// assert.equal(player.direction, Direction.Up);
// rotate(player, "R");
// assert.equal(player.direction, Direction.Right);

export default solve;
