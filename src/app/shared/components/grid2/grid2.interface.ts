import { Column } from 'ag-grid';
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
  filterColumnName?: string;
}

export interface IGrid2SortingDirectionSwitchPayload {
  columnId: string;
  multiSort: boolean;
  sortingDirection: Grid2SortingEnum;
}

export interface IGrid2ColumnsPositionsChangePayload {
  columnsPositions: string[]
}

export interface IGrid2ShowFilterPayload {
  filterColumnName: string;
}

export enum Grid2SortingEnum {
  ASC,
  DESC
}

export interface IActionGrid2Payload {
  type: string;
  payload: IGrid2SortingDirectionSwitchPayload
    |IGrid2ColumnsPositionsChangePayload
    |IGrid2ShowFilterPayload;
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
}
