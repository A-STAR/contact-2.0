type IValueGetter<T, R> = (data: T) => R;

export interface IGridWrapperTreeColumn<T> {
  label: string;
  prop?: keyof T;
  valueGetter?: IValueGetter<T, string>;
  valueFormatter?: IValueGetter<T, string>;
  dictCode?: IValueGetter<T, number> | string;
}
