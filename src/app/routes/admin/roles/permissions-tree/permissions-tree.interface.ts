export interface IPermissionsTreeNode {
  children?: IPermissionsTreeNode[];
  dsc: string;
  id: number;
  name: string;
  objType: number;
  value: boolean;
}
