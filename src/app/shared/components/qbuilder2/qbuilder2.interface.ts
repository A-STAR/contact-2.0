import { ColDef } from 'ag-grid';

import { FilterOperatorType, FilterObject } from '../grid2/filter/grid-filter';

export interface IQuery {
  columns: Array<ColDef>;
  filters: FilterObject;
}

export type IFilterType = 'text' | 'number' | 'set' | 'date';

export interface IOperator {
  name: FilterOperatorType;
  filters?: Array<IFilterType>;
}
