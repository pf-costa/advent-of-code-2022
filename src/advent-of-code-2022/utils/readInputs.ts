import readInput from "./readInput";

const readInputs = (day: number) => {
  const example = readInput(day, true);
  const input = readInput(day);
  return {
    example,
    input,
  };
};

export default readInputs;
