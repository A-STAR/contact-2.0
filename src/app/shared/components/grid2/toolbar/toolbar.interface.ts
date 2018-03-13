export enum ToolbarControlEnum {
  BUTTON,
  CHECKBOX,
  LABEL,
  SELECT,
}

export enum ToolbarActionTypeEnum {
  REFRESH,
  GO_FORWARD,
  GO_BACKWARD,
  GO_FIRST,
  GO_LAST,
}

export interface IToolbarButton {
  disabled: boolean;
  type?: ToolbarActionTypeEnum;

}

export interface IToolbarAction {
  activeValue?: any;
  control?: ToolbarControlEnum;
  disabled?: boolean;
  hasLabel?: boolean;
  permission?: string | Array<string>;
  styles?: { width?: string };
  text?: string;
  type?: ToolbarActionTypeEnum;
  value?: any;
  visible?: boolean;
}

export interface IToolbarActionSelect {
  action: IToolbarAction;
  value: any;
}
