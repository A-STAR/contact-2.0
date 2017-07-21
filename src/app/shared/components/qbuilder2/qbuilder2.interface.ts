import { ColDef } from 'ag-grid';

import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';

export interface IQuery {
  columns: Array<ColDef>;
  filters: FilterObject;
}

export type IOperatorType = 'text';

export interface IOperator {
  // TODO(d.maltsev): stronger typing
  name: string;
  filters?: Array<IOperatorType>;
}
