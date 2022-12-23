const createStateMachine = (
  valves: Map<string, number>,
  start: string,
  getDistance: (from: string, to: string) => number,
  initialTicks: number
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
        const nextTicks = this.ticks - distance - 1;

        // Is it possible to go the next valve and open it?
        return nextTicks > 0;
      });

      this.flowRate = flowRate;
      this.previous = previous;
      this.pressure = pressure;

      if (this.unOpenedValves.length === 0 && this.ticks > 0) {
        // If so compute the remainder pressure
        this.pressure = pressure + (ticks - 1) * flowRate;
      }
    }

    clone() {
      return new StateItem(
        this.ticks,
        this.unOpenedValves.slice(0),
        this.valve,
        this.flowRate,
        this.previous,
        this.pressure
      );
    }

    openValve(to: string) {
      const distance = getDistance(this.valve, to);

      // We arrived at the valve
      const nextTicks = this.ticks - distance - 1;
      const passedTicks = this.ticks - nextTicks;

      // Is it possible to go the next valve and open it?
      if (nextTicks < 0) {
        throw new Error("Should never occur");
      }

      const unOpenedValves = this.unOpenedValves.filter((u) => u !== to);

      const flowRate = valves.get(to) || 0;
      const pressure = passedTicks * this.flowRate + flowRate;

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

  return new StateItem(initialTicks, Array.from(valves.keys()), start, 0);
};

export type State = ReturnType<typeof createStateMachine>;

export default createStateMachine;
