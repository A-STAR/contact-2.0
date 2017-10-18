export interface INode {
  children?: Array<INode>;
  component?: any;
  container?: 'tabs' | 'flat';
  title?: string;
  inject?: object;
}
