import { toBoolSizedArray, binaryFromArray } from '@app/core/utils/general';

export interface IStateTreeParams {
  /**
   * dataKeys used to create all possible states (Math.pow(2, dataKeys.length)),
   * and to change respective data props
   */
  dataKeys: any[];
  /**
   * Array of rules for matching state changes:
   * [ fromState, toState, resultState ][]
   * where:
   * fromState - current state
   * toState - transitioning state
   * resultState - result state
   * I.e. given:
   * {
   *  mask: [ [ 0, 1, 3 ] ],
   *  dataKeys: [ 'first', 'second' ]
   * },
   * means that if node with state === fromState going to transition to toState,
   * it should transition to resultState instead.
   *
   * Creation of states array could be overriden by passing createStates fn.
   *
   * If no rule is matched, then transition procceedes normally (fromState -> toState)
   */
  mask: [any, any, any][];
  /**
   * Function to transform passed data to state
   * If it is not passed, then state is derived from dataKeys values as array of booleans
   * @param data
   */
  dataToState?(data: any): any;
   /**
   * Function to transform state to data
   * If it is not passed, then data is derived from bitwise state and dataKeys
   * @param state
   */
  stateToData?(state: any): any;
  /**
   *  Array of rules for matching state changes for parents nodes, when some child node has changed
   * [ childFromState, childToState, parentFromState, resultState ][]
   * where:
   * childFromState - current CHILD state in states array
   * childToState - transitioning CHILD state in states array
   * parentFromState - current PARENT state in states array
   * resultState - result PARENT state in states array
   */
  parentsMask?: [any, any, any, any][];
  /**
   *  Array of rules for matching state changes for children nodes, when some parent node has changed
   * [ parentFromState, parentToIndex, childFromState, resultState ][]
   * where:
   * childFromState - current PARENT state in states array
   * childToState - transitioning PARENT state in states array
   * childFromState - current CHILD state in states array
   * resultState - result CHILD state in states array
   */
  childrenMask?: [any, any, any, any][];
  /**
   * Overrides default creation of possible states array
   */
  createStates?(): any[];
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
  private states: any[];

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
    this.createStates = params.createStates || this.createStates.bind(this);
    this.stateToData = params.stateToData || this.stateToData.bind(this);
    this.states = this.createStates();
    this.root = new StateTreeNode(null, ['root']);
  }

  onChange(path: string[], data: any): void {
    const node = this.findNode(path);
    if (node) {
      const fromState = node.currentState;
      const toState = this.transformState(fromState, this.dataToState(data));
      if (fromState !== toState) {
        this.onNodeChange(node, toState);
        this.changeRelatedTreeNodes(node, fromState, toState);
      }
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

  private onNodeChange(node: StateTreeNode, toState: any): void {
    const cb = node.onChange(toState);
    if (cb) {
      cb(this.stateToData(node.currentState));
    }
  }

  private changeRelatedTreeNodes(node: StateTreeNode, prev: any, next: any): any {
    if (this.params.childrenMask && this.isMatchedPartRule(prev, next, this.params.childrenMask)) {
      this.changeChildrenState(node, prev, next);
    }

    if (this.params.parentsMask && this.isMatchedPartRule(prev, next, this.params.parentsMask)) {
      this.changeParentsState(node, prev, next);
    }
  }

  private changeChildrenState(node: StateTreeNode, prev: any, next: any): void {
    if (node.children && node.children.length) {
      node.children.forEach(n => n.children && n.children.length ? this.changeChildrenState(n, prev, next)
        : this.onNodeChange(n, this.transformChildrenState(prev, next, n.currentState)));
    }
  }

  private changeParentsState(node: StateTreeNode, prev: any, next: any): void {
    let _node = node.parent;
    while (_node && !_node.isRoot) {
      this.onNodeChange(_node, this.transformParentsState(prev, next, _node.currentState));
      _node = _node.parent;
    }
  }

  private transformState(prev: any, next: any): any {
    const rule = this.params.mask.find(r => r[0] === prev && r[1] === next);
    const state = rule ? rule[2] : next;
    return this.states.includes(state) ? this.states[state] : this.states[prev];
  }

  private transformChildrenState(prev: any, next: any, selfState: any): any {
    const rule = this.params.childrenMask.find(r => r[0] === prev && r[1] === next && r[2] === selfState);
    return rule ? this.states[rule[3]] : this.states[next];
  }

  private transformParentsState(prev: any, next: any, selfState: any): any {
    const rule = this.params.parentsMask.find(r => r[0] === prev && r[1] === next && r[2] === selfState);
    return rule ? rule[3] : next;
  }

  private isMatchedPartRule(prev: any, next: any, mask: [any, any, any, any][]): boolean {
    return !!mask.find(r => r[0] === prev && r[1] === next);
  }

  private dataToState(data: any): any {
    return binaryFromArray(this.params.dataKeys.map(k => data[k]));
  }

  private stateToData(state: any): { [key: string]: boolean } {
    const boolArr = toBoolSizedArray(state, this.params.dataKeys.length || 1);
    return (this.params.dataKeys && this.params.dataKeys.length ? this.params.dataKeys : Object.keys(boolArr))
      .reduce((acc, key, i) => ({
        ...acc,
        [key]: boolArr[i]
      }), {});
  }

  private createStates(): number[] {
    return Array.from(Array(Math.pow(2, this.params.dataKeys.length)).keys());
  }
}


