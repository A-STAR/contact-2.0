import { SelectItem } from './select-item';

export interface OptionsBehavior {
  first(): any;
  last(): any;
  prev(): any;
  next(): any;
  filter(query: RegExp): any;
  getSelectNativeElement(): Element;
}

export interface ISelectComponent {
  options: Array<SelectItem>;
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
