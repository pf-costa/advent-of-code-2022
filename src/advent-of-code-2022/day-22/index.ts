import assert from "node:assert";
import solve, { Direction, solve2 } from "../day-22/solve";
import readInputs from "../utils/readInputs";
import { getData } from "./getData";
import { getCorners } from "./getOnOutOfBounds";

const { example, input } = readInputs(22);
assert.equal(solve(example), 6032);
assert.equal(solve(input), 27492);

// console.log(solve2(example, 4));

// const data = getData(input);

// const corners = getCorners(data.tiles);

// assert.equal(corners.length, 3);
