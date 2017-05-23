export interface IDataSource {
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
  dataKey: string;
}

export interface IParameters {
  [index: string]: any;
}

export type TSelectionType = 'single' | 'multiClick' | 'multi' | undefined;

export interface IGridColumn {
  localized?: boolean;
  prop: string;
  name?: string;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  $$valueGetter?: Function;
}
