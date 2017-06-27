import { Column } from 'ag-grid';
import { Renderer2 } from '@angular/core';

import { FilterObject } from './filter/grid2-filter';

import { GridHeaderComponent } from './header/grid-header.component';

export interface IGrid2ColumnSettings {
  sortingDirection?: Grid2SortingEnum;
  sortingOrder?: number;
  filter?: FilterObject;
}

export interface IGrid2ColumnsSettings {
  [key: string]: IGrid2ColumnSettings;
}

export interface IGrid2ColumnsSettingsInfo {
  columnsSettings?: IGrid2ColumnsSettings;
}

export interface IGrid2PaginationInfo {
  currentPage?: number;
  pageSize?: number;
}

export interface IGrid2State extends IGrid2PaginationInfo, IGrid2ColumnsSettingsInfo {
  columnsPositions: string[];
  groupingColumns: string[];
  selectedRows: any[];
  columnMovingInProgress: boolean;
  currentFilterColumn?: Column;
  filterColumnName?: string;
}

export interface IGrid2ColumnsSortingDirectionInfo {
  columnId: string;
  sortingDirection: Grid2SortingEnum;
  sortingOrder: number;
}

export interface IGrid2ColumnFilterPayload {
  columnId: string;
  filter: FilterObject;
}

export interface IGrid2SortingDirectionSwitchPayload extends IGrid2ColumnsSortingDirectionInfo {
  multiSort: boolean;
}

export interface IGrid2ColumnsPositionsChangePayload {
  columnsPositions: string[];
}

export interface IGrid2GroupingColumnsChangePayload {
  groupingColumns: string[];
}

export interface IGrid2SelectedRowChangePayload {
  rowData: any;
  selected: boolean;
}

export interface IGrid2ShowFilterPayload {
  currentFilterColumn: Column;
}

export enum Grid2SortingEnum {
  NONE,
  ASC,
  DESC
}

export interface IActionGrid2Payload {
  type: string;
  payload: IGrid2SortingDirectionSwitchPayload
    |IGrid2ColumnsPositionsChangePayload
    |IGrid2ShowFilterPayload
    |IGrid2GroupingColumnsChangePayload
    |IGrid2SelectedRowChangePayload
    |IGrid2ColumnMovingPayload
    |IGrid2ColumnFilterPayload
    |number;
}

export interface IGrid2ServiceDispatcher {
  allGridColumns: Column[];
  dispatchSortingDirection(payload: IGrid2SortingDirectionSwitchPayload): void;
  dispatchColumnsPositions(payload: IGrid2ColumnsPositionsChangePayload): void;
}

export interface IGrid2HeaderParams {
  headerHeight: number;
  enableMenu?: boolean;
  serviceDispatcher: IGrid2ServiceDispatcher;
  headerColumns?: GridHeaderComponent[];
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

export interface IGrid2RequestPayload extends IGrid2PaginationInfo, IGrid2ColumnsSettingsInfo {
  fieldNameConverter?: Function;
}

export interface IGrid2EventPayload {
  type: string;
  payload?: number
    |IGrid2ColumnsPositionsChangePayload
    |IGrid2ColumnMovingPayload
    |IGrid2ShowFilterPayload
    |IGrid2GroupingColumnsChangePayload
    |IGrid2SelectedRowChangePayload
    |IGrid2SortingDirectionSwitchPayload
    |IGrid2ColumnFilterPayload;
}
