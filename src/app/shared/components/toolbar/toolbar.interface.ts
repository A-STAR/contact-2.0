export enum ToolbarControlEnum {
  BUTTON,
  CHECKBOX
}

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
  control?: ToolbarControlEnum;
  value?: any;
}
