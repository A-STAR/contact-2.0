import { RowNode, ColDef } from 'ag-grid';

import { FilterObject } from './filter/grid2-filter';

export type AGridSortType = 'asc' | 'desc' | null;
export type IGrid2ColumnPositions = string[];
export type IGrid2Groups  = string[];
export type IGrid2Selected = Array<any>;

export interface IAGridColumn {
  colId: string;
  disabled?: boolean;
  filter?: string;
  filterValues?: Array<any>;
  filterDictionaryId?: number;
  hide?: boolean;
  localized?: boolean;
  maxWidth?: number;
  minWidth?: number;
  renderer?: Function;
  sort?: AGridSortType;
  type?: string;
  width?: number;
}

// The sortModel has no native interface defined
export interface IAGridSortModel {
  colId: string;
  sort: string;
}

export interface IAGridSettings {
  sortModel: IAGridSortModel[];
  colDefs: ColDef[];
}

export interface IGrid2Sorter {
  direction: AGridSortType;
  field: string;
}

export interface IGrid2Filter {
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
  positions: IGrid2ColumnPositions;
  groups: string[];
  selectedRows: any[];
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
  payload?:
    number
    |IGrid2Filter
    |IGrid2ColumnPositions
    |IGrid2Groups
    |IGrid2Selected
    |IGrid2Sorter[]
    ;
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
