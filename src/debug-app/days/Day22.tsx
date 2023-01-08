import {
  process,
  Player,
  Direction,
  getOnOutOfBounds1,
} from "../../advent-of-code-2022/day-22/solve";
import input from "../../../inputs/input-22.txt";
import { useEffect, useState } from "react";
import styles from "./Day22.module.css";
import { flushSync } from "react-dom";
import { getData } from "../../advent-of-code-2022/day-22/getData";

const cubeSize = 4;

const Day22 = () => {
  const [data, setData] = useState<ReturnType<typeof getData>>(null);
  const [player, setPlayer] = useState<Player>(undefined);
  const [visited, setVisited] = useState<Player[]>([]);
  const [lines, setLines] = useState<string[]>();
  const [instruction, setInstruction] = useState<number | string>();

  useEffect(() => {
    const map = input.split("\n");

    setLines(map.slice(0, map.length - 2));
    const data = getData(map, cubeSize);
    const onOutOfBounds = getOnOutOfBounds1(data.tiles);
    setData(data);

    const processor = process(
      data.player,
      data.tiles,
      data.instructions,
      onOutOfBounds
    );
    setPlayer(data.player);
    setVisited((v) => v.concat({ ...data.player }));

    const step = () => {
      const { value, done } = processor.next();

      if (done) {
        flushSync(() => {
          setInstruction("Done");
        });
      }

      if (!value) {
        return;
      }

      const { instruction, player } = value;

      if (player) {
        console.log(player);

        flushSync(() => {
          setVisited((v) => v.concat(player));
          setPlayer(player);
        });
      }

      if (instruction) {
        flushSync(() => {
          setInstruction(instruction);
        });
      }
    };

    let interval;

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        step();
      }

      if (e.key === " ") {
        if (interval) {
          clearInterval(interval);
          interval = undefined;
        } else {
          interval = setInterval(step, 100);
        }
      }
    });
  }, []);

  if (!data) {
    return null;
  }

  const getCell = (tile: string, row: number, column: number) => {
    let key = column + "-" + "row";

    if (tile === " ") {
      return (
        <span key={key}>
          <>&nbsp;</>
        </span>
      );
    }

    let visit = visited.find((v) => v.column === column && v.row === row);

    if (visit) {
      const isPlayer = row === player.row && column === player.column;
      let color = isPlayer ? "blue" : "green";
      let dir = "→";

      switch (isPlayer ? player.direction : visit.direction) {
        case Direction.Down:
          dir = "↓";
          break;

        case Direction.Up:
          dir = "↑";
          break;

        case Direction.Left:
          dir = "←";
          break;
      }

      return (
        <span key={key} style={{ color }}>
          {dir}
        </span>
      );
    }

    return <span key={key}>{tile}</span>;
  };

  const drawBoard = () => {
    return (
      <div className={styles.board}>
        {lines.map((row, i) => (
          <div key={i}>
            {Array.from(row).map((col, j) => getCell(col, i, j))}
          </div>
        ))}
      </div>
    );
  };

  // console.log(example);
  return (
    <div>
      Instruction: {instruction} &nbsp; Player: {player.column} {player.row}
      <hr />
      {drawBoard()}
    </div>
  );
};

export default Day22;
