import { State } from "./createStateMachine";

const biasParam = Math.sqrt(2);

export default class TreeNode {
  parent: TreeNode | undefined;
  // For an opened valve, there is a node
  children: Map<string, TreeNode | null>;
  visits: number;
  wins: number;
  flowRate: number;
  valve: string;
  state: State;

  constructor(state: State, valve: string, parent?: TreeNode) {
    this.parent = parent;
    this.state = state;
    this.valve = valve;

    this.children = new Map();
    state.unOpenedValves.forEach((v) => this.children.set(v, null));

    // Statistics
    this.visits = 0;
    this.wins = 0;
    this.flowRate = 0;
  }

  isFullyExpanded() {
    for (let [_, node] of this.children) {
      if (!node) {
        return false;
      }
    }

    return true;
  }

  expand(to: string) {
    if (!this.children.has(to)) {
      throw new Error("Invalid transition");
    }

    const nextState = this.state.openValve(to);

    if (!nextState) {
      // Not possible to expand
      throw new Error("Invalid transition");
    }

    const child = new TreeNode(nextState, to, this);
    this.children.set(to, child);

    return child;
  }

  isLeaf() {
    return this.children.size === 0;
  }

  getUCB1() {
    return (
      this.wins / this.visits +
      biasParam *
        Math.sqrt(Math.log(this.parent?.visits as number) / this.visits)
    );
  }
}
