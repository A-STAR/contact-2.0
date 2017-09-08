export interface IGridTreeRow<T> {
  data: T;
  children?: Array<IGridTreeRow<T>>;
}
