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
  disabled?: boolean;
  filterControlType?: ControlTypes;
  localized?: boolean;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  prop: string;
  renderer?: Function;
  /*
  ** For compatibility with @swimlane/ngx-datatable
  ** Do NOT use, prefer renderer
  */
  suppressSizeToFit?: boolean;
  $$valueGetter?: Function;
  width?: number;
}

export interface IRenderer {
  [key: string]: Function | Array<any>;
}
