export interface IStateTreeParams {
  dataToState?(data: any): number;
  transformState?(prev: number, next: number): number;
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
        node = new StateTreeNode(initialState, path);
        this.children.push(node);
        node.parent = this;
        return;
      } else {

        const foundChild = this.children.find(c => c.path[c.path.length - 1] === currentPath[0]);

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
      return this.children.find(c => c.path[c.path.length - 1] === path[0]);
    } else {
      const foundChild = this.children.find(c => c.path[c.path.length - 1] === path[0]);
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

  onChange(state: any): void {
    this.currentState = state;
  }

  toString(indent: number = 0): string {
    const str = !this.isRoot ? new Array(indent + 1).join(' ') + this.path[this.path.length - 1] + '\n' : '';
    return str + (this.children && this.children.length ? this.children.map(c => c.toString(indent + 1)).join('') : '');
  }
}

export class StateTree {
  private root: StateTreeNode;

  constructor(options: IStateTreeParams = {}) {
    this.transformState = options.transformState || this.transformState;
    this.dataToState = options.dataToState || this.dataToState;
    this.root = new StateTreeNode(null, ['root']);
  }

  onChange(path: string[], data: any): void {
    const node = this.findNode(path);
    if (node) {
      node.onChange(this.transformState(node.currentState, this.dataToState(data)));
    }
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

  private transformState: (prev: number, next: number) => number = (_: number, next: number) => next;
  private dataToState: (data: any) => number = data => Number(data);

}


