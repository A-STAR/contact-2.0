import { ColDef } from 'ag-grid';

import { FilterOperatorType } from '../grid2/filter/grid2-filter';

import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';

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
