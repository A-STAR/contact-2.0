export enum ToolbarControlEnum {
  BUTTON,
  CHECKBOX,
  LABEL
}

export enum ToolbarActionTypeEnum {
  ADD,
  EDIT,
  CLONE,
  REMOVE,
  REFRESH,
  SEARCH,
  SAVE,
}

export interface IToolbarAction {
  text?: string;
  hasLabel?: boolean;
  type?: ToolbarActionTypeEnum;
  visible?: boolean;
  permission?: string | Array<string>;
  control?: ToolbarControlEnum;
  value?: any;
}
