export type IDataToValue<T, R> = (value: string | number | Date, data: T) => R;

export interface IGridWrapperTreeColumn<T> {
  label: string;
  prop?: keyof T;
  valueGetter?: IDataToValue<T, any>;
  valueFormatter?: IDataToValue<T, string>;
  dictCode?: ((data: T) => number) | number;
}
