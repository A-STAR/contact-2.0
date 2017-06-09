import { Column } from 'ag-grid';
import { Renderer2 } from '@angular/core';
import { GridHeaderComponent } from './header/grid-header.component';

export interface IGrid2ColumnState {
  sortingDirection: Grid2SortingEnum;
}

export interface IGrid2ColumnsState {
  [columnId: string]: IGrid2ColumnState
}

export interface IGrid2State {
  columns: IGrid2ColumnsState;
  columnsPositions: string[];
  groupingColumns: string[];
  filterColumnName?: string;
  movingColumnInProgress?: boolean;
}

export interface IGrid2ColumnsSortingDirectionInfo {
  columnId: string;
  sortingDirection: Grid2SortingEnum;
}

export interface IGrid2SortingDirectionSwitchPayload extends IGrid2ColumnsSortingDirectionInfo {
  multiSort: boolean;
}

export interface IGrid2ColumnsPositionsChangePayload {
  columnsPositions: string[]
}

export interface IGrid2GroupingColumnsChangePayload {
  groupingColumns: string[]
}

export interface IGrid2ShowFilterPayload {
  filterColumnName: string;
}

export interface IGrid2MovedColumnPayload {
  movingColumnInProgress: boolean;
}

export enum Grid2SortingEnum {
  ASC,
  DESC
}

export interface IActionGrid2Payload {
  type: string;
  payload: IGrid2SortingDirectionSwitchPayload
    |IGrid2ColumnsPositionsChangePayload
    |IGrid2ShowFilterPayload
    |IGrid2MovedColumnPayload
    |IGrid2GroupingColumnsChangePayload;
}

export interface IGrid2ServiceDispatcher {
  dispatchShowFilter(payload: IGrid2ShowFilterPayload): void;
  dispatchCloseFilter(): void;
  dispatchSortingDirection(payload: IGrid2SortingDirectionSwitchPayload): void;
  dispatchColumnsPositions(payload: IGrid2ColumnsPositionsChangePayload): void;
}

export interface IGrid2HeaderParams {
  headerHeight: number;
  enableMenu: boolean;
  serviceDispatcher: IGrid2ServiceDispatcher;
  headerColumns: GridHeaderComponent[];
  column?: Column;
  renderer2: Renderer2;
}
