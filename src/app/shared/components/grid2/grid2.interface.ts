import { Column, RowNode } from 'ag-grid';
import { Renderer2 } from '@angular/core';

import { FilterObject } from './filter/grid2-filter';

export interface IGrid2Filter {
  name?: string;
  operator?: string;
  values?: any;
}

export interface IGrid2ColumnSettings {
  sortDirection?: Grid2SortingEnum;
  sortOrder?: number;
  filter?: FilterObject;
}

export interface IGrid2ColumnsSettings {
  [key: string]: IGrid2ColumnSettings;
}

export interface IGrid2PaginationInfo {
  currentPage?: number;
  pageSize?: number;
}

export interface IGrid2State extends IGrid2PaginationInfo {
  columnsSettings?: IGrid2ColumnsSettings;
  columnsPositions: string[];
  groupingColumns: string[];
  selectedRows: any[];
  columnMovingInProgress: boolean;
  filterColumnName?: string;
}

export interface IGrid2ColumnFilterPayload {
  columnId: string;
  filter: FilterObject;
}

export interface IGrid2SortDirectionPayload {
  columnId: string;
  sortDirection: Grid2SortingEnum;
  sortOrder: number;
}

export interface IGrid2ColumnsPositionsPayload {
  columnsPositions: string[];
}

export interface IGrid2GroupingColumnsPayload {
  groupingColumns: string[];
}

export interface IGrid2SelectedPayload {
  rowData: any;
  selected: boolean;
}

export enum Grid2SortingEnum {
  NONE,
  ASC,
  DESC
}

export interface IActionGrid2Payload {
  type: string;
  payload: IGrid2ColumnsPositionsPayload
    |IGrid2SortDirectionPayload
    |IGrid2GroupingColumnsPayload
    |IGrid2SelectedPayload
    |IGrid2ColumnMovingPayload
    |IGrid2ColumnsPositionsPayload
    |IGrid2ColumnFilterPayload
    |number;
}

export interface IGrid2HeaderParams {
  headerHeight: number;
  enableMenu?: boolean;
  column?: Column;
  renderer2: Renderer2;
}

export interface IGrid2ColumnMovingPayload {
  movingColumnInProgress: boolean;
}

export interface IGrid2RequestSorting {
  field: string;
  direction: string;
  order?: number;
}

export interface IGrid2Request {
  paging?: {
    pageNumber: number,
    resultsPerPage: number
  };
  sorting?: IGrid2RequestSorting[];
  filtering?: FilterObject;
}

export interface IGrid2RequestPayload extends IGrid2PaginationInfo {
  columnsSettings?: IGrid2ColumnsSettings;
  fieldNameConverter?: Function;
  gridFilters?: IGrid2Filter[];
}

export interface IGrid2EventPayload {
  type: string;
  payload?: number
    |IGrid2ColumnFilterPayload
    |IGrid2ColumnsPositionsPayload
    |IGrid2ColumnMovingPayload
    |IGrid2GroupingColumnsPayload
    |IGrid2SelectedPayload
    |IGrid2SortDirectionPayload;
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
