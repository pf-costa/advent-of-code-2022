import { readInput } from "./utils";

type File = {
  name: string;
  size: number;
};

type Node = {
  name: string;
  readonly size: number;
  directories: Map<string, Node>;
  files: Map<string, File>;
  parent?: Node;
};

const createNode = (name: string, parent?: Node): Node => {
  const files = new Map<string, File>();
  const directories = new Map<string, Node>();

  return {
    name,
    parent,
    get size() {
      const fileSizes = Array.from(files.entries()).reduce(
        (acc, f) => acc + f[1].size,
        0
      );

      const directorySizes = Array.from(directories.entries()).reduce(
        (acc, d) => {
          return acc + d[1].size;
        },
        0
      );

      return fileSizes + directorySizes;
    },
    directories,
    files,
  };
};

const root = createNode("/");
let currentNode = root;

// Commands
const changeDirectory = (target: string) => {
  // For now simplify
  if (target === "/") {
    currentNode = root;
    return;
  }

  // For now simplify
  if (target === "..") {
    currentNode = currentNode?.parent || root;
    return;
  }

  let node = currentNode.directories.get(target) as Node;

  if (node) {
    currentNode = node;
    return;
  }

  throw new Error("Must never happen");
};

const listContents = (lines: string[]) => {
  lines.forEach((l) => {
    const [value, name] = l.split(" ");

    if (value === "dir") {
      if (!currentNode.directories.has(name)) {
        currentNode.directories.set(name, createNode(name, currentNode));
      }

      return;
    }

    currentNode.files.set(name, {
      name,
      size: +value,
    });
  });
};

const input = readInput(7);

// Just a simple copy
let lines = input.slice(0);

while (lines.length > 0) {
  // Get all the lines that are from the current command
  let nextIndex = lines.slice(1).findIndex((l) => l.startsWith("$")) + 1;

  if (nextIndex === 0) {
    nextIndex = lines.length;
  }

  let statements = lines.slice(0, nextIndex);

  // End of file
  if (statements.length === 0) {
    break;
  }

  // Move cursor
  lines = lines.slice(nextIndex);

  const [command, ...args] = statements[0].split(" ").slice(1);
  statements = statements.slice(1);

  switch (command) {
    case "cd":
      changeDirectory(args[0]);
      break;

    case "ls":
      listContents(statements);
      break;
  }
}

function getAllDirectories(node: Node): Node[] {
  const dirs = [...node.directories.values()];

  return dirs.concat(dirs.flatMap(getAllDirectories));
}

const allDirs = Array.from(getAllDirectories(root));

// Part 1
const part1 = allDirs
  .filter((d) => d.size <= 100000)
  .reduce((acc, d) => acc + d.size, 0);

// Part 2
const totalSize = root.size;
const unusedSpace = 70000000 - totalSize;
const requiredSpace = 30000000 - unusedSpace;

const part2 = allDirs
  .sort((a, b) => a.size - b.size)
  .find((r) => r.size >= requiredSpace);

console.log(part1, part2?.name, part2?.size);
