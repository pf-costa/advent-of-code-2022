import readInput from "./utils/readInput";

enum Mineral {
  Ore,
  Clay,
  Obsidian,
  Geode,
}

type Limits = Map<Mineral, number>;

const getEnumValues = (e: { [s: string]: unknown } | ArrayLike<unknown>) =>
  Object.values(e).filter((v) => !isNaN(Number(v)));

type Items = Partial<Record<Mineral, number>>;
type Requirement = [Mineral, number];
type BluePrint = Partial<Record<Mineral, Requirement[]>>;

let defaultMinerals: Items = {};
let defaultRobots: Items = {};

getEnumValues(Mineral)
  .reverse()
  .forEach((v: Mineral) => {
    defaultMinerals[v] = 0;
    defaultRobots[v] = 0;
  });

type State = {
  minutes: number;
  robots: Items;
  minerals: Items;
  snapshots: number[];
};

const stateMachine = (bluePrint: BluePrint) => {
  const allRequirements = Object.values(bluePrint).flatMap((e) => e);
  let maxMinerals = new Array(Mineral.Geode);
  maxMinerals[Mineral.Geode] = Infinity;

  allRequirements.forEach(([m, amount]) => {
    if (maxMinerals[m] === undefined || maxMinerals[m] < amount) {
      maxMinerals[m] = amount;
    }
  });

  function* getNextStates(state: State, limits: Limits): Generator<Mineral> {
    if (state.minutes === 0) {
      return undefined;
    }

    for (let m = 0; m < maxMinerals.length; m++) {
      const max = maxMinerals[m];

      // Have we reached the limit for this robot?
      if (m !== Mineral.Geode && state.robots[m] >= max) {
        continue;
      }

      const limit = limits.get(m);

      // Stop producing mineral after X minutes
      if (limit && state.minutes <= limit) {
        continue;
      }

      let isAble = true;

      // Are we able to build this robot?
      for (let [min, amount] of bluePrint[m]) {
        if (state.minerals[min] + state.robots[min] * state.minutes < amount) {
          isAble = false;
          break;
        }
      }

      if (isAble) {
        yield m;
      }
    }

    return undefined;
  }

  const work = (state: State) => {
    let minerals: Items = {};

    for (let [mineral, count] of Object.entries(state.robots)) {
      const current = state.minerals[+mineral];
      minerals[+mineral] = current + count;
    }

    return minerals;
  };

  const canBuild = (state: State, robot: Mineral) => {
    let requirements = bluePrint[robot];
    return requirements.every(([min, amount]) => state.minerals[min] >= amount);
  };

  const build = (state: State, robot: Mineral) => {
    let requirements = bluePrint[robot];

    let newState: State = {
      minerals: { ...state.minerals },
      robots: { ...state.robots },
      minutes: state.minutes,
      snapshots: state.snapshots.slice(0),
    };

    while (!canBuild(newState, robot)) {
      newState.minerals = work(newState);
      newState.minutes--;
    }

    // Subtract minerals
    for (let [mineral, amount] of requirements) {
      newState.minerals[mineral] -= amount;
    }

    newState.minerals = work(newState);
    newState.robots[robot]++;

    if (robot === Mineral.Geode) {
      newState.snapshots.push(newState.minutes);
    }

    newState.minutes--;

    return newState;
  };

  return {
    getNextStates,
    build,
  };
};

const getNumbers = (l: string) =>
  Array.from(l.matchAll(/(\d+)/g)).map((e) => +e[0]);

const input = readInput(19).map((l) => {
  const [bp, phrases] = l.split(":");
  const robots = phrases.split(".");

  let blueprint: BluePrint = {};
  let ore: number, clay: number, obsidan: number;

  [ore] = getNumbers(robots[0]);
  blueprint[Mineral.Ore] = [[Mineral.Ore, ore]];

  [ore] = getNumbers(robots[1]);
  blueprint[Mineral.Clay] = [[Mineral.Ore, ore]];

  [ore, clay] = getNumbers(robots[2]);
  blueprint[Mineral.Obsidian] = [
    [Mineral.Ore, ore],
    [Mineral.Clay, clay],
  ];

  [ore, obsidan] = getNumbers(robots[3]);
  blueprint[Mineral.Geode] = [
    [Mineral.Ore, ore],
    [Mineral.Obsidian, obsidan],
  ];

  return {
    id: getNumbers(bp)[0],
    blueprint,
  };
});

const simulateDfs = (
  bluePrint: BluePrint,
  limits: Limits,
  totalMinutes: number
) => {
  const t0 = performance.now();

  let { build, getNextStates } = stateMachine(bluePrint);
  let queue: Array<State> = [
    {
      minutes: totalMinutes,
      minerals: { ...defaultMinerals },
      robots: { ...defaultRobots, [Mineral.Ore]: 1 },
      snapshots: [],
    },
  ];
  let maxGeodes = 0;
  let state: State;

  // Store the best minutes when a geode robot was created
  const snapshots = new Map<number, number>();

  while (queue.length > 0) {
    state = queue.pop();

    if (state.minutes < 0) {
      continue;
    }

    let geodes = state.minerals[Mineral.Geode];

    if (geodes > 0) {
      let minute = totalMinutes - state.minutes;

      if (
        !snapshots.has(geodes) ||
        totalMinutes - snapshots.get(geodes) < minute
      ) {
        snapshots.set(geodes, minute);
      } else {
        // Discard this state
        continue;
      }
    }

    if (geodes > maxGeodes) {
      maxGeodes = geodes;
    }

    for (let next of getNextStates(state, limits)) {
      if (next === undefined) {
        continue;
      }

      queue.push(build(state, next));
    }
  }

  const t1 = performance.now();
  console.log(`Found total geodes in ${t1 - t0}`);
  return maxGeodes;
};

const solve1 = () => {
  let results = new Map<number, number>();

  const limits: Limits = new Map();
  limits.set(Mineral.Ore, 16);
  limits.set(Mineral.Clay, 8);

  for (let { id, blueprint } of input) {
    const geodes = simulateDfs(blueprint, limits, 24);
    results.set(id, geodes);
  }

  let total = Array.from(results.entries()).reduce(
    (acc, [id, geodes]) => acc + id * geodes,
    0
  );

  console.log(total);
};

const solve2 = () => {
  let results = new Map<number, number>();

  const limits: Limits = new Map();
  limits.set(Mineral.Ore, 17);
  limits.set(Mineral.Clay, 8);

  const chunk = input.slice(0, 3);

  for (let { id, blueprint } of chunk) {
    const geodes = simulateDfs(blueprint, limits, 32);
    results.set(id, geodes);
  }

  let total = Array.from(results.entries()).reduce(
    (acc, [_, geodes]) => acc * geodes,
    1
  );

  console.log(total);
};

solve1();
solve2();
