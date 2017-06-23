import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

export type SelectInputValueType = number|string|ILabeledValue[];

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

export interface IRawDataFilterPipeParams {
  sortType: string;
  filterValue: string;
}
