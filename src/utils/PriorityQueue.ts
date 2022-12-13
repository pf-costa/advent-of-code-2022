// Kudos to https://github.com/albertorestifo/node-dijkstra/blob/master/libs/PriorityQueue.js
type Item = {
  key: string;
  priority: number;
};

export default class PriorityQueue {
  keys: Set<string>;
  queue: Item[];

  constructor() {
    this.keys = new Set();
    this.queue = [];
  }

  set(key: string, value: number | string) {
    const priority = Number(value);
    if (isNaN(priority)) throw new TypeError('"priority" must be a number');

    if (!this.keys.has(key)) {
      // Insert a new entry if the key is not already in the queue
      this.keys.add(key);
      this.queue.push({ key, priority });
    } else {
      // Update the priority of an existing key
      this.queue.map((element) => {
        if (element.key === key) {
          Object.assign(element, { priority });
        }

        return element;
      });
    }

    this.sort();
    return this.queue.length;
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  next() {
    const element = this.queue.shift();

    if (element) {
      // Remove the key from the `_keys` set
      this.keys.delete(element.key);
    }

    return element;
  }

  isEmpty() {
    return Boolean(this.queue.length === 0);
  }

  has(key: string) {
    return this.keys.has(key);
  }

  get(key: string) {
    return this.queue.find((element) => element.key === key) as Item;
  }
}
