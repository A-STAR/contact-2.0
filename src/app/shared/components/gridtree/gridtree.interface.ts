export interface IGridTreeRow<T> {
  data: T;
  parentId?: number | string;
  children?: Array<IGridTreeRow<T>>;
  isExpanded?: boolean;
  sortOrder?: number;
}

type IDataToValue<T, R> = (value: boolean | number | string | Date, data: T) => R;

export interface IGridTreeColumn<T> {
  label: string;
  prop?: keyof T;
  valueGetter?: IDataToValue<T, boolean | number | string | Date>;
  valueFormatter?: IDataToValue<T, string>;
}

export enum GridTreeDragAndDropEventTypeEnum {
  INTO,
  AFTER,
}

export interface IGridTreeDragAndDropEvent<T> {
  draggedRow: IGridTreeRow<T>;
  targetRow: IGridTreeRow<T>;
  type: GridTreeDragAndDropEventTypeEnum;
}

export type IUniqueIdGetter<T> = (row: IGridTreeRow<T>) => number | string;
