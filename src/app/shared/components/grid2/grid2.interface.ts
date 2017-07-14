import { RowNode } from 'ag-grid';

import { FilterObject } from './filter/grid2-filter';

export type Grid2SortingType = 'asc' | 'desc' | null;

export type IGrid2ColumnsPositions = string[];

export interface IGrid2Sorter {
  direction: Grid2SortingType;
  field: string;
}

export interface IGrid2ColumnFilter {
  columnId: string;
  filter: FilterObject;
}

export interface IGrid2ExportableColumn {
  field: string;
  name: string;
}

export interface IGrid2RequestParams {
  currentPage?: number;
  pageSize?: number;
  sorters?: IGrid2Sorter[];
}

export interface IGrid2State extends IGrid2RequestParams {
  columnsPositions: IGrid2ColumnsPositions;
  groupingColumns: string[];
  selectedRows: any[];
}

export interface IGrid2GroupingColumns {
  groupingColumns: string[];
}

export interface IGrid2Selected {
  rowData: any;
  selected: boolean;
}

export interface IActionGrid2Payload {
  type: string;
  payload: IGrid2ColumnsPositions
    |IGrid2Sorter[]
    |IGrid2GroupingColumns
    |IGrid2Selected
    |IGrid2ColumnsPositions
    |IGrid2ColumnFilter
    |number;
}

export interface IGrid2Request {
  paging?: {
    pageNumber: number,
    resultsPerPage: number
  };
  sorting?: IGrid2Sorter[];
  filtering?: FilterObject;
}

export interface IGrid2EventPayload {
  type: string;
  payload?: number
    |IGrid2ColumnFilter
    |IGrid2ColumnsPositions
    |IGrid2GroupingColumns
    |IGrid2Selected
    |IGrid2Sorter[];
}

// need this, since ag-grid doesn't export this interface
export interface IViewportDatasourceParams {
    /** datasource calls this method when the total row count changes. This in turn sets the height of the grids vertical scroll. */
    setRowCount: (count: number) => void;
    /** datasource calls this when new data arrives. The grid then updates the provided rows. The rows are mapped [rowIndex]=>rowData].*/
    setRowData: (rowData: {
        [key: number]: any;
    }) => void;
    /** datasource calls this when it wants a row node - typically used when it wants to update the row node */
    getRow: (rowIndex: number) => RowNode;
}
