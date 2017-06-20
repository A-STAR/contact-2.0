import { ControlTypes } from '../form/dynamic-form/dynamic-form-control.interface';

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
  suppressSizeToFit?: boolean;
  prop: string;
  name?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  $$valueGetter?: Function;
  filterControlType?: ControlTypes;
}

export interface IRenderer {
  [key: string]: Function | Array<any>;
}
