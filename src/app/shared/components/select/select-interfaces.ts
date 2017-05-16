export interface OptionsBehavior {
  first(): any;
  last(): any;
  prev(): any;
  next(): any;
  filter(query: RegExp): any;
  getSelectNativeElement(): Element;
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
