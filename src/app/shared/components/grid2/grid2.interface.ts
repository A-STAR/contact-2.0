import { RowNode, ColDef } from 'ag-grid';

import { FilterObject } from './filter/grid-filter';

export type AGridSortType = 'asc' | 'desc' | null;
export type IAGridGroups  = string[];
export type IAGridSelected = Array<any>;

export interface IAGridColumn {
  colId: string;
  disabled?: boolean;
  filter?: string;
  filterValues?: Array<any>;
  filterDictionaryId?: number;
  hide?: boolean;
  maxWidth?: number;
  minWidth?: number;
  renderer?: Function;
  sort?: string;
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

export interface IAGridSorter {
  direction: string;
  field: string;
}

export interface IAGridFilter {
  columnId: string;
  filter: FilterObject;
}

export interface IAGridFilterRequest {
  filters: FilterObject;
  currentPage?: number;
}

export interface IAGridExportableColumn {
  field: string;
  name: string;
}

export interface IAGridRequestParams {
  currentPage?: number;
  pageSize?: number;
  sorters?: IAGridSortModel[];
}

export interface IAGridState extends IAGridRequestParams {
  groups: string[];
  selectedRows: any[];
}

export interface IAGridRequest {
  paging?: {
    pageNumber: number,
    resultsPerPage: number
  };
  sorting?: IAGridSorter[];
  filtering?: FilterObject;
}

export interface IAGridEventPayload {
  type: string;
  payload?:
    number
    |IAGridFilter
    |IAGridGroups
    |IAGridSelected
    |IAGridSortModel[]
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
