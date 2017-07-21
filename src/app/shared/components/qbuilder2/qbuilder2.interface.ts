import { ColDef } from 'ag-grid';

import { FilterOperatorType, FilterObject } from '../grid2/filter/grid-filter';

export interface IQuery {
  columns: Array<ColDef>;
  filters: FilterObject;
}

export type IFilterType = 'text';

export interface IOperator {
  // TODO(d.maltsev): stronger typing
  name: FilterOperatorType;
  filters?: Array<IFilterType>;
}
