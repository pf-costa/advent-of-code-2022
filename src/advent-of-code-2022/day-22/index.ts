import assert from "node:assert";
import solve from "../day-22/solve";
import readInputs from "../utils/readInputs";

const { example, input } = readInputs(22);
assert.equal(solve(example), 6032);
console.log(solve(input));
