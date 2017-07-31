export interface INode {
  children?: Array<INode>;
  component?: any;
  container?: 'tabs' | 'flat'
  key?: string;
  title?: string;
  // TODO(d.maltsev): keys of linked nodes
}
