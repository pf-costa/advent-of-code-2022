import PriorityQueue from "./PriorityQueue";
export type Graph = Record<string, Record<string, number>>;

// Dijkstra's algoritm
const shortestPath = (graph: Graph, start: string, end: string) => {
  const visited = new Set<string>();

  const previous = new Map<string, string>();
  const priorities = new PriorityQueue();
  priorities.set(start, 0);

  while (!priorities.isEmpty()) {
    const current = priorities.next();

    if (!current) {
      break;
    }

    const { key, priority } = current;

    if (key === end) {
      const result: string[] = [];
      let next = end;

      while (true) {
        next = previous.get(next) as string;

        if (!next) {
          break;
        }

        result.push(next);
      }

      return result;
    }

    visited.add(key);

    // Get unexplored neighbours
    const neighbours = graph[key];

    Object.entries(neighbours).forEach(([neighbour, cost]) => {
      if (visited.has(neighbour)) {
        return;
      }

      const nodeCost = priority + cost;

      // If the neighboring node is not yet in the frontier, we add it with
      // the correct cost
      if (!priorities.has(neighbour)) {
        previous.set(neighbour, key);
        priorities.set(neighbour, nodeCost);
        return;
      }

      // Get the current priority
      const { priority: currentPriority } = priorities.get(neighbour);

      if (nodeCost < currentPriority) {
        previous.set(key, key);
        priorities.set(neighbour, nodeCost);
      }
    });
  }
};

export default shortestPath;
