export enum ToolbarControlEnum {
  BUTTON,
  CHECKBOX
}

export enum ToolbarActionTypeEnum {
  ADD,
  EDIT,
  CLONE,
  REMOVE,
  REFRESH
}

export interface IToolbarAction {
  text: string;
  type: ToolbarActionTypeEnum;
  visible?: boolean;
  permission?: string | Array<string>;
  control?: ToolbarControlEnum;
  value?: any;
}
