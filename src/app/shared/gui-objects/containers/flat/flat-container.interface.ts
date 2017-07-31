export interface INode {
  children?: Array<INode>;
  component?: any;
  key?: string;
  // TODO(d.maltsev): keys of linked nodes
}
