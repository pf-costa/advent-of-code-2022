import readInput from "../utils/readInput";
import { Graph } from "../utils/shortestPath";
import createStateMachine, { State } from "./createStateMachine";
import floydWarshall from "../utils/floydWarshall";

const graph: Graph = {};
const valves = new Map<string, number>();

readInput(16).map((l) => {
  const [valve, ...rest] = Array.from(l.matchAll(/([A-Z][A-Z])/g)).map(
    (e) => e[0]
  );
  const flowRate = Number(l.match(/(\d+)/)?.[0] as string);

  const edges = rest.reduce((acc, v) => {
    return {
      ...acc,
      [v]: 1,
    };
  }, {} as Record<string, number>);

  if (flowRate === 0) {
    graph[valve] = {
      ...edges,
    };

    return;
  }

  valves.set(valve, flowRate);

  graph[valve] = { ...edges };
});

const withElephant = false;
const maxTicks = 30;
const startValve = "AA";
const { distances, vertexIndices } = floydWarshall(graph);

const getDistance = (from: string, to: string) => {
  const index = vertexIndices[from];
  const nextIndex = vertexIndices[to];
  return distances[index][nextIndex];
};

const state = createStateMachine(valves, startValve, getDistance);

const bfs = (root: State, bestPath: string[] | undefined) => {
  let queue: Array<State> = [];
  queue.push(root);

  let maxPressure = -Infinity;
  let bestState: State = root;

  let state: State | undefined;

  const assureLast = (s: State) => {};

  while (queue.length > 0) {
    // Get all valid neighbours
    state = queue.pop();

    if (!state) {
      break;
    }

    if (bestPath && state.valve !== bestPath[0]) {
      continue;
    }

    bestPath?.shift();

    for (let valve of state.unOpenedValves) {
      if (bestPath && valve !== bestPath[0]) {
        continue;
      }

      let next = state.openValve(valve);

      if (!next) {
        continue;
      }

      if (maxPressure < next.pressure) {
        maxPressure = next.pressure;
        bestState = next;
      }

      queue.push(next);
    }

    // Have we reach the end of line?
    if (state.unOpenedValves.length === 0 && maxTicks > state.ticks) {
      // If so compute the remainder pressure
      let pressure = state.pressure + (maxTicks - state.ticks) * state.flowRate;

      if (maxPressure < pressure) {
        maxPressure = pressure;
      }
    }
  }

  let last = bestState;
  const path = [];
  while (last) {
    path.push(
      last.valve + " " + last.ticks + " " + last.pressure + " " + last.flowRate
    );

    last = last.previous as State;
  }

  path.reverse().forEach((p) => console.log(p));

  return maxPressure;
};

const max = bfs(state, undefined);
console.log(max);

// assert.equal(max, sol[1]);
