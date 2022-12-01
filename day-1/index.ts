import path from "path";
import fs from "fs";

const txt = fs.readFileSync(path.resolve(__dirname, "input.txt")).toString();

const caloriesByElf = txt
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

console.log("Most calories", caloriesByElf[0]);
console.log(
  "Total top 3 calories",
  caloriesByElf.slice(0, 3).reduce((t, c) => t + c)
);
