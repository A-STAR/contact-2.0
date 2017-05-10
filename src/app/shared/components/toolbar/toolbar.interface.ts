export enum ToolbarActionTypeEnum {
  ADD,
  EDIT,
  CLONE,
  REMOVE
}

export interface IToolbarAction {
  text: string;
  type: ToolbarActionTypeEnum;
  visible?: boolean;
  permission?: string;
}
