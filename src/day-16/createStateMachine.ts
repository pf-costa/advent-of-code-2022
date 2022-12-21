import { memoize } from "lodash";
import shortestPath, { Graph } from "../utils/shortestPath";

export const createDistanceCounter = (
  graph: Graph,
  routes: Map<string, string>
) =>
  memoize(
    (from: string, to: string) => {
      let distance = 0;
      let next = to;

      const isNeighbour = (n1: string, n2: string) => {
        // Direct neighbour
        return Object.keys(graph[n1]).includes(n2);
      };

      while (next !== from) {
        let node = routes.get(next) as string;

        if (!node) {
          if (isNeighbour(next, from)) {
            return distance + 1;
          }

          const p = shortestPath(graph, from, to);
          return Array.isArray(p) ? p.length : Object.keys(p).length;
        }

        next = node;
        distance++;
      }

      return distance;
    },
    (f, t) => f + t
  );

const createStateMachine = (
  valves: Map<string, number>,
  start: string,
  getDistance: (from: string, to: string) => number,
  maxTicks = 30
) => {
  class StateItem {
    ticks: number;
    valve: string;
    unOpenedValves: string[];
    flowRate: number;
    previous: StateItem | undefined;
    pressure: number;

    constructor(
      ticks: number,
      unOpenedValves: string[],
      valve: string,
      flowRate: number,
      previous?: State,
      pressure = 0
    ) {
      this.ticks = ticks;
      this.valve = valve;
      this.unOpenedValves = unOpenedValves.filter((to) => {
        const distance = getDistance(this.valve, to);
        const nextTicks = this.ticks + distance + 1;

        // Is it possible to go the next valve and open it?
        return maxTicks > nextTicks;
      });
      this.flowRate = flowRate;
      this.previous = previous;
      this.pressure = pressure;
    }

    openValve(to: string) {
      const distance = getDistance(this.valve, to);

      // We arrived at the valve
      const nextTicks = this.ticks + distance + 1;

      const passedTicks = nextTicks - this.ticks;

      // Is it possible to go the next valve and open it?
      if (maxTicks <= nextTicks) {
        return null;
      }

      const unOpenedValves = this.unOpenedValves.filter((u) => u !== to);

      const flowRate = valves.get(to) || 0;
      const pressure = this.pressure + passedTicks * this.flowRate + flowRate;

      const nextFlowRate = flowRate + this.flowRate;

      let next = new StateItem(
        nextTicks,
        unOpenedValves,
        to,
        nextFlowRate,
        this,
        pressure
      );

      return next;
    }
  }

  return new StateItem(1, Array.from(valves.keys()), start, 0);
};

export type State = ReturnType<typeof createStateMachine>;

export default createStateMachine;
