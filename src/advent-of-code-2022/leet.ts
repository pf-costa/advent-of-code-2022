import { equal } from "assert";

function intToRoman(num: number): string {
  const roman = new Map<number, string>();

  roman.set(1, "I");
  roman.set(5, "V");
  roman.set(10, "X");
  roman.set(50, "L");
  roman.set(100, "C");
  roman.set(500, "D");
  roman.set(1000, "M");

  return Array.from(roman.entries())
    .reverse()
    .reduce((total, [value, char], i, elements) => {
      let txt = num.toString().charAt(0);

      let delta = Math.floor(num / value);

      if (delta === 0) {
        return total;
      }

      if (txt.charAt(0) === "9") {
        const [next, char1] = elements[i + 1];
        const [prev, char2] = elements[i - 1];

        total += char1 + char2;
        num -= prev - next;
        return total;
      }

      if (txt.charAt(0) == "4") {
        const [val1, char1] = elements[i - 1] || elements[elements.length - 1];

        total += char + char1;
        num -= val1 - value;
        return total;
      }

      total += char.repeat(delta);
      num -= delta * value;

      return total;
    }, "");
}

equal(intToRoman(40), "XL");
equal(intToRoman(1994), "MCMXCIV");

console.log();
