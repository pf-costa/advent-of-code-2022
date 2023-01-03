import readInput from "../utils/readInput";
import { Graph } from "../utils/shortestPath";
import createStateMachine, { State } from "./createStateMachine";
import floydWarshall from "../utils/floydWarshall";
import { curry, memoize } from "lodash";

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

const startValve = "AA";
const { distances, vertexIndices } = floydWarshall(graph);

const getDistance = (from: string, to: string) => {
  const index = vertexIndices[from];
  const nextIndex = vertexIndices[to];
  return distances[index][nextIndex];
};

const deepFirstSearch = memoize(
  (state: State): [number, string[]] => {
    let maxPressure = 0;
    let bestPath: string[] = [];

    for (let valve of state.unOpenedValves) {
      const next = state.openValve(valve);

      if (!next) {
        continue;
      }

      let [pressure, path] = deepFirstSearch(next);

      if (next.pressure + pressure > maxPressure) {
        maxPressure = next.pressure + pressure;
        bestPath = [next.valve, ...path];
      }
    }

    return [maxPressure, bestPath];
  },
  (state) => {
    return `${state.ticks}-${state.unOpenedValves.join()}-${state.valve}}-${
      state.flowRate
    }-${state.pressure}`;
  }
);

const allValves = Array.from(valves.keys());
const createState = curry(createStateMachine)(valves, startValve, getDistance);

// Part 1
let state = createState(30);
let [maxPressure, path] = deepFirstSearch(state);
console.log("Part 1", maxPressure);

// Part 2
// Human goes first
state = createState(26);
[maxPressure, path] = deepFirstSearch(state);

// Then the elephant
state = createState(26);
state.unOpenedValves = allValves.filter((a) => !path.includes(a));

let [maxPressureElephant] = deepFirstSearch(state);
console.log("Part 2", maxPressure + maxPressureElephant);
