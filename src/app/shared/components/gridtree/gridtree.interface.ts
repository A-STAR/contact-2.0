export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
}

export interface IGridTreeColumn<T> {
  label: string;
  prop: keyof T;
}
