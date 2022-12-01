import path from "path";
import fs from "fs";

const txt = fs.readFileSync(path.resolve(__dirname, "input.txt")).toString();

const mostCalories = txt
  .split("\n")
  .reduce(
    (acc, current) => {
      if (current.length === 0) {
        acc.push(0);
        return acc;
      }

      const index = acc.length - 1;
      acc[index] = acc[index] + +current;

      return acc;
    },
    [0]
  )
  .sort((a, b) => b - a);

console.log(mostCalories[0]);
