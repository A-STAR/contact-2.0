export enum PaginationControl {
  BUTTON,
  CHECKBOX,
  LABEL,
  SELECT,
}

export enum PaginationActionType {
  REFRESH,
  GO_FORWARD,
  GO_BACKWARD,
  GO_FIRST,
  GO_LAST,
}

export interface PaginationButton {
  disabled: boolean;
  type?: PaginationActionType;
}

export interface PaginationAction {
  activeValue?: any;
  control?: PaginationControl;
  disabled?: boolean;
  hasLabel?: boolean;
  permission?: string | Array<string>;
  styles?: { width?: string };
  text?: string;
  type?: PaginationActionType;
  value?: any;
  visible?: boolean;
}

export interface PaginationActionSelect {
  action: PaginationAction;
  value: any;
}
