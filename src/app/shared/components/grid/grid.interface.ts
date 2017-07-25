export type TSelectionType = 'single' | 'multiClick' | 'multi' | undefined;

export interface IGridColumn {
  disabled?: boolean;
  localized?: boolean;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  prop: string;
  renderer?: Function;
  type?: string;
  // technical use only by grid.service.ts
  $$valueGetter?: Function;
  width?: number;
}

export interface IRenderer {
  [key: string]: Function | Array<any>;
}

export interface IMessages {
  [key: string]: string;
}
