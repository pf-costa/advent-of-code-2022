import readInput from "./utils/readInput";

const getCommand = (line: string) => {
  const [quantity, from, to] = Array.from(line.matchAll(/(\d+)/g)).map(
    (r) => +r[0]
  );

  return [quantity, from, to];
};

const getStacks = (board: string[]) => {
  // Last line contains the numbers
  const columns = +board[board.length - 1]
    .split(" ")
    .filter((f) => f)
    .slice(-1);

  const positions = Array.from(Array(columns));

  // Parse items from lines
  const lines = board
    .slice(0, board.length - 1)
    .reverse()
    .map((l) => {
      return positions.map((p, i) => {
        const start = i * 4;

        return l.substring(start).substring(1, 2).trim();
      });
    });

  // Fill the stacks
  const stacks = positions.map(() => [] as string[]);

  lines.forEach((line) => {
    line.forEach((l, index) => {
      if (l) {
        stacks[index].push(l[0]);
      }
    });
  });

  return stacks;
};

type MoveArgs = {
  quantity: number;
  origin: string[];
  target: string[];
};

const moveWithSplice = ({ quantity, origin, target }: MoveArgs) => {
  const item = origin.splice(origin.length - quantity);

  target.push(...item);
};

const moveWithPop = ({ quantity, origin, target }: MoveArgs) => {
  for (let index = 0; index < quantity; index++) {
    const item = origin.pop();

    if (!item) {
      break;
    }

    target.push(item);
  }
};

(() => {
  const input = readInput(5);

  const separator = input.findIndex((f) => f === "");
  const board = input.slice(0, separator);
  const stacks = getStacks(board);
  const commands = input.slice(separator + 1).map(getCommand);

  // Not happy about this, will mutate the stacks variable
  commands.forEach(([quantity, from, to]) => {
    const origin = stacks[from - 1];
    const target = stacks[to - 1];

    // Part 1 - use pop
    // moveWithPop({ quantity, origin, target });

    // Part 2
    moveWithSplice({ quantity, origin, target });
  });

  const result = stacks.flatMap((s) => s[s.length - 1] || " ").join("");

  console.log(result);
})();
