import { toBoolSizedArray, binaryFromArray } from '@app/core/utils';

export interface IStateTreeParams {
  dataKeys: any[];
  mask: number[][];
  dataToState?(data: any): number;
  parentsMask?: number[][];
  childrenMask?: number[][];
}

export class StateTreeNode {
  parent: StateTreeNode;
  children: StateTreeNode[] = [];
  currentState: number;

  constructor(
    initialState: number,
    public path: string[],
    public callback?: (data: any) => void
  ) {
    this.currentState = initialState;
  }

  addNode(path: string[], initialState: number, cb: (data: any) => void, currentPath?: string[]): StateTreeNode {
    let node: StateTreeNode;
    currentPath = currentPath || path;
    while (currentPath.length) {
      if (currentPath.length === 1) {
        node = this.findChild(currentPath);
        if (node) {
          node.currentState = initialState;
          node.callback = cb;
        } else {
          node = new StateTreeNode(initialState, path, cb);
          this.children.push(node);
          node.parent = this;
        }
        return node;
      } else {

        const foundChild = this.findChild(currentPath);

        if (!foundChild) {

          const pathIndex = path.findIndex( p => p === currentPath[0]);

          node = new StateTreeNode(initialState, path.slice(0, pathIndex + 1), cb);

          this.children.push(node);
          node.parent = this;
          return node.addNode(path, initialState, cb, currentPath.slice(1));
        } else {
          return foundChild.addNode(path, initialState, cb, currentPath.slice(1));
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

  onChange(state: number): (data: any) => void {
    this.currentState = state;
    if (this.callback) {
      return data => this.callback(data);
    }
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

  static actionsToStates(dataKeys: any[]): number[] {
    return Array.from(Array(Math.pow(2, dataKeys.length)).keys());
  }

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
    this.states = StateTree.actionsToStates(this.params.dataKeys);
    this.root = new StateTreeNode(null, ['root']);
  }

  onChange(path: string[], data: any): void {
    const node = this.findNode(path);
    if (node) {
      const fromState = node.currentState;
      const toState = this.transformState(fromState, this.dataToState(data));
      this.onNodeChange(node, toState);
      this.changeRelatedTreeNodes(node, fromState, toState);
    }
  }

  addNode(path: string[], data: any, cb?: (data: any) => void): void {
    this.root.addNode(path, this.dataToState(data), cb);
  }

  findNode(path: string[]): StateTreeNode {
    return this.root.findNode(path);
  }

  toString(): string {
    return this.root.toString();
  }

  private onNodeChange(node: StateTreeNode, toState: number): void {
    const cb = node.onChange(toState);
    if (cb) {
      cb(this.stateToData(node.currentState));
    }
  }

  private changeRelatedTreeNodes(node: StateTreeNode, prev: number, next: number): any {
    let state: number;
    if (this.params.childrenMask && this.isMatchedRule(prev, next, this.params.childrenMask)) {
      state = this.transformChildrenState(prev, next);
      this.changeChildrenState(node, state);
    }

    if (this.params.parentsMask && this.isMatchedRule(prev, next, this.params.parentsMask)) {
      state = this.transformParentsState(prev, next);
      this.changeParentsState(node, state);
    }
  }

  private changeChildrenState(node: StateTreeNode, state: number): void {
    if (node.children && node.children.length) {
      node.children.forEach(n => n.children && n.children.length ? this.changeChildrenState(n, state)
        : this.onNodeChange(n, this.transformState(n.currentState, state)));
    }
  }

  private changeParentsState(node: StateTreeNode, state: number): void {
    let _node = node.parent;
    while (_node && !_node.isRoot) {
      this.onNodeChange(_node, this.transformState(_node.currentState, state));
      _node = _node.parent;
    }
  }

  private transformState(prev: number, next: number): number {
    return this._transformState(prev, next, this.params.mask);
  }

  private transformChildrenState(prev: number, next: number): number {
    return this._transformState(prev, next, this.params.childrenMask);
  }

  private transformParentsState(prev: number, next: number): number {
    return this._transformState(prev, next, this.params.parentsMask);
  }

  private _transformState(prev: number, next: number, mask: number[][]): number {
    const rule = mask.find(r => r[0] === prev && r[1] === next);
    return rule ? this.states[rule[2]] : next;
  }

  private isMatchedRule(prev: number, next: number, mask: number[][]): boolean {
    return !!mask.find(r => r[0] === prev && r[1] === next);
  }

  private dataToState(data: any): number {
    return binaryFromArray(this.params.dataKeys.map(k => data[k]));
  }

  private stateToData(state: number): { [key: string]: boolean } {
    const boolArr = toBoolSizedArray(state, this.params.dataKeys.length || 1);
    return (this.params.dataKeys && this.params.dataKeys.length ? this.params.dataKeys : Object.keys(boolArr))
      .reduce((acc, key, i) => ({
        ...acc,
        [key]: boolArr[i]
      }), {});
  }
}


