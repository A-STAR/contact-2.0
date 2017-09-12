export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
}

export interface IGridTreeColumn<T> {
  label: string;
  prop: keyof T;
}

export interface IGridTreeRowEvent<T> {
  row: IGridTreeRow<T>;
  event: MouseEvent;
}
