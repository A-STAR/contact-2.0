import { FilterOperatorType } from '../../../shared/components/grid2/filter/grid-filter';
import { TControlTypes } from '../form/dynamic-form/dynamic-form.interface';
import { IDialogMultiSelectFilterType } from '../form/dialog-multi-select/dialog-multi-select.interface';

export interface IFilterControl {
  label: string;
  controlName: string;
  type: TControlTypes;
  filterType?: IDialogMultiSelectFilterType;
  dictCode?: number;
  width: number;
  iconCls?: string;
  operator?: FilterOperatorType;
  filterParams?: any;
}

export interface IFilterEntry {
  [key: string]: any;
}
