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
  localized?: boolean;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  prop: string;
  renderer?: Function;
  width?: number;
  /*
  ** For compatibility with @swimlane/ngx-datatable
  ** Do NOT use, prefer renderer
  */
  $$valueGetter?: Function;
  /**
   * ag-grid
   */
  suppressMenu?: boolean;
  suppressSizeToFit?: boolean;
  filter?: string;
}

export interface IRenderer {
  [key: string]: Function | Array<any>;
}

export interface IMessages {
  [key: string]: string;
}
