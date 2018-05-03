import { toBoolSizedArray, binaryFromArray } from '@app/core/utils';

export interface IStateTreeParams {
  dataKeys: any[];
  mask: number[][];
  dataToState?(data: any): number;
  // shouldChangeParentState(prev: number, next: number): boolean;
  // shouldChangeChildrenState(prev: number, next: number): boolean;
  // tranformParentState(prev: number, next: number): number;
  // transformChildrenState(prev: number, next: number): number;
}

export class StateTreeNode {
  parent: StateTreeNode;
  children: StateTreeNode[] = [];
  currentState: number;

  constructor(
    initialState: number,
    public path: string[],
  ) {
    this.currentState = initialState;
  }

  addNode(path: string[], initialState: number, currentPath?: string[]): void {
    let node: StateTreeNode;
    currentPath = currentPath || path;
    while (currentPath.length) {
      if (currentPath.length === 1) {
        node = this.findChild(currentPath);
        if (node) {
          node.currentState = initialState;
        } else {
          node = new StateTreeNode(initialState, path);
          this.children.push(node);
          node.parent = this;
        }
        return;
      } else {

        const foundChild = this.findChild(currentPath);

        if (!foundChild) {

          const pathIndex = path.findIndex( p => p === currentPath[0]);

          node = new StateTreeNode(initialState, path.slice(0, pathIndex + 1));

          this.children.push(node);
          node.parent = this;
          return node.addNode(path, initialState, currentPath.slice(1));
        } else {
          return foundChild.addNode(path, initialState, currentPath.slice(1));
        }
      }
    }
  }

  findNode(path: string[]): StateTreeNode {
    if (path.length === 1) {
      if (this.path[this.path.length - 1] === path[0]) {
        return this;
      }
      return this.findChild(path);
    } else {
      const foundChild = this.findChild(path);
      path = path.slice(1);
      return path.length && foundChild ? foundChild.findNode(path) : foundChild;
    }
  }

  get isRoot(): boolean {
    return this.path[this.path.length - 1] === 'root';
  }

  hasChildren(): boolean {
    return this.children && !!this.children.length;
  }

  onChange(state: number): void {
    this.currentState = state;
  }

  toString(indent: number = 0): string {
    const str = !this.isRoot ? new Array(indent + 1).join(' ') + this.path[this.path.length - 1] + '\n' : '';
    return str + (this.children && this.children.length ? this.children.map(c => c.toString(indent + 1)).join('') : '');
  }

  private findChild(path: string[]): StateTreeNode {
    return this.children.find(c => c.path[c.path.length - 1] === path[0]);
  }
}

export class StateTree {
  private root: StateTreeNode;
  private states: number[];

  constructor(private params: IStateTreeParams) {

    if (!params) {
      throw new Error('Params for state tree not found!');
    }

    if (params && !params.dataKeys) {
      throw new Error('Data keys for state tree not found!');
    }

    if (params && !params.mask) {
      throw new Error('Rule mask for state tree not found!');
    }

    this.dataToState = params.dataToState || this.dataToState.bind(this);
    this.states = this.actionsToStates(this.params.dataKeys);
    this.root = new StateTreeNode(null, ['root']);
  }

  onChange(path: string[], data: any): { [key: string]: boolean } {
    const node = this.findNode(path);
    if (node) {
      node.onChange(this.transformState(node.currentState, this.dataToState(data)));
    }
    return this.stateToData(node.currentState);
  }

  addNode(path: string[], data: any): void {
    this.root.addNode(path, this.dataToState(data));
  }

  findNode(path: string[]): StateTreeNode {
    return this.root.findNode(path);
  }

  toString(): string {
    return this.root.toString();
  }

  private stateToData(state: number): { [key: string]: boolean } {
    const boolArr = toBoolSizedArray(state, this.params.dataKeys.length || 1);
    return (this.params.dataKeys.length ? this.params.dataKeys : Object.keys(boolArr))
      .reduce((acc, key, i) => ({
        ...acc,
        [key]: boolArr[i]
      }), {});
  }

  private actionsToStates(dataKeys: any[]): number[] {
    return Array.from(Array(Math.pow(2, dataKeys.length)).keys());
  }

  private transformState(prev: number, next: number): number {
    const rule = this.params.mask.find(r => r[0] === prev && r[1] === next);
    return rule ? this.states[rule[2]] : next;
  }

  private dataToState(data: any): number {
    return binaryFromArray(this.params.dataKeys.map(k => data[k]));
  }
}


