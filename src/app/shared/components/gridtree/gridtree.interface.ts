export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
  isExpanded?: boolean;
}

type IDataToValue<T, R> = (value: string | number | Date, data: T) => R;

export interface IGridTreeColumn<T> {
  label: string;
  prop?: keyof T;
  valueGetter?: IDataToValue<T, string | number | Date>;
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
