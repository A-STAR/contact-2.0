import { FilterOperatorType } from '../../../shared/components/grid2/filter/grid-filter';
import { IDynamicFormControl } from '../form/dynamic-form/dynamic-form.interface';

export interface IFilterControl extends IDynamicFormControl {
  operator?: FilterOperatorType;
  filterParams?: any;
}

export interface IFilterEntry {
  [key: string]: any;
}
