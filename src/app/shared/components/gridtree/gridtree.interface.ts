export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
  isExpanded?: boolean;
}

export interface IGridTreeColumn<T> {
  label: string;
  prop: keyof T;
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
