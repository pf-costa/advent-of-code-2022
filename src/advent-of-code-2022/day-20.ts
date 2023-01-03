import readInputs from "./utils/readInputs";
import assert from "assert";

class Node {
  previous: Node;
  next: Node;
  value: number;

  constructor(value: number) {
    this.value = value;
    this.previous = this.next = null;
  }
}

class CircularList {
  size = 0;
  current: Node;

  push(value: number) {
    this.size++;

    let node = new Node(value);

    if (!this.current) {
      node.previous = node.next = node;
    } else {
      let next = this.current.next;

      this.current.next = node;
      node.previous = this.current;
      node.next = next;
      next.previous = node;
    }

    this.current = node;
    return node;
  }

  move(node: Node) {
    if (node.value === 0) {
      return;
    }

    let amount = node.value % (this.size - 1);
    let target: keyof Node = node.value < 0 ? "previous" : "next";

    // if (amount > half) {
    //   amount = this.size - amount;
    //   target = target === "next" ? "previous" : "next";
    // }

    if (amount === 0) {
      return;
    }

    let current = node;
    for (let i = 0; i === 0 || i < Math.abs(amount); i++) {
      current = current[target];
    }

    // Remove the node
    node.previous.next = node.next;
    node.next.previous = node.previous;
    node.previous = null;
    node.next = null;

    if (amount > 0) {
      // Add next
      let currentNext = current.next;
      currentNext.previous = node;
      current.next = node;

      node.next = currentNext;
      node.previous = current;
    } else {
      // Add before
      const currentPrevious = current.previous;

      currentPrevious.next = node;
      current.previous = node;

      node.previous = currentPrevious;
      node.next = current;
    }
  }

  get(from: Node, iterations: number) {
    const amount = iterations % this.size;

    let current = from;

    for (let i = 0; i < amount; i++) {
      current = current.next;
    }

    return current;
  }

  *toArray() {
    yield this.current.value;

    let next = this.current.next;

    while (next != this.current) {
      yield next.value;
      next = next.next;
    }
  }

  print() {
    let a = Array.from(this.toArray());
    console.log(a.join(","));
  }
}

const { example, input } = readInputs(20);

const solve = (input: string[], rounds = 1, decryptionKey = 1) => {
  let nodes = [];
  const circular = new CircularList();

  input.forEach((l) => {
    let node = circular.push(+l * decryptionKey);
    nodes.push(node);
  });

  circular.current = nodes[0];

  for (let i = 0; i < rounds; i++) {
    nodes.forEach((n) => {
      circular.move(n);
    });
  }

  const node0 = nodes.find((n) => n.value === 0);
  const total = [1000, 2000, 3000].reduce(
    (acc, n) => acc + circular.get(node0, n).value,
    0
  );

  return total;
};

// Part 1
assert.equal(solve(example), 3);
assert.equal(solve(input), 11616);

// Part 2
const decryptionKey = 811589153;
const rounds = 10;
assert.equal(solve(example, rounds, decryptionKey), 1623178306);

const e = solve(input, rounds, decryptionKey);
console.log(e);
