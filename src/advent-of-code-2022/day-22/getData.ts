import { getKey } from "./getKey";
import { Tile, CubeFace, Direction } from "./solve";

const getTiles = (lines: string[], faceSize?: number) => {
  const tiles = new Map<string, Tile>();

  let rowIndex = 0;
  let columnIndex = 0;

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];

    if (row !== 0 && row % faceSize === 0) {
      rowIndex++;
    }

    columnIndex = 0;

    for (let column = 0; column < line.length; column++) {
      const item = line[column];

      if (item === " ") {
        continue;
      }

      if (column !== 0 && column % faceSize === 0) {
        columnIndex++;
      }

      let cubeIndex = columnIndex + rowIndex * 2;

      let tile: Tile = {
        column,
        row,
        isWall: item === "#",
        cube: cubeIndex as CubeFace,
      };
      tiles.set(getKey(column, row), tile);
    }
  }

  return tiles;
};

const getInstructions = (line: string) => {
  return Array.from(line.matchAll(/(\d+)|(R|L)/g)).map(([l]) =>
    isNaN(+l) ? l : +l
  );
};

export const getData = (lines: string[], faceSize?: number) => {
  const mapLines = lines.slice(0, lines.length - 2);
  const tiles = getTiles(mapLines, faceSize);

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
