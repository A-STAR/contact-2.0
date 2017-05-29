export type IdType = number|string;

export interface OptionsBehavior {
  first(): any;
  last(): any;
  prev(): any;
  next(): any;
}

export enum SelectionActionTypeEnum {
  SORT
}

export interface ISelectionAction {
  text: string;
  type: SelectionActionTypeEnum;
  state?: any;
  actionIconCls?: string;
}
