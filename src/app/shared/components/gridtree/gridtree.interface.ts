export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
}

export interface IGridTreeColumn<T> {
  label: string;
  prop: keyof T;
}

export enum GridTreeDragAndDropEventType {
  INTO,
  AFTER,
}

export interface IGridTreeDragAndDropEvent<T> {
  draggedRow: IGridTreeRow<T>;
  targetRow: IGridTreeRow<T>;
  type: GridTreeDragAndDropEventType;
}
