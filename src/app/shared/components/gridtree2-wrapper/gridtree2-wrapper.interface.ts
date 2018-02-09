export type IDataToValue<T, R> = (value: any, data: T) => R;

export interface IAGridWrapperTreeColumn<T> {
  name: string;
  label?: string;
  dataType: number;
  dictCode?: number;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  isDataPath?: boolean;
  valueGetter?: IDataToValue<T, any>;
  valueFormatter?: IDataToValue<T, string>;
}
