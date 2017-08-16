import { ILabeledValue } from '../../../../core/converter/value-converter.interface';

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

export type SelectInputValueType = number|string|ILabeledValue[];
