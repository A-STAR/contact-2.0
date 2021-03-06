import { IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { FilterOperatorType, FilterObject } from '../grid2/filter/grid-filter';

export interface IQuery {
  columns: Array<IAGridColumn>;
  filters: FilterObject;
}

export type IFilterType = 'text' | 'number' | 'set' | 'date';

export interface IOperator {
  name: FilterOperatorType;
  filters?: Array<IFilterType>;
}
