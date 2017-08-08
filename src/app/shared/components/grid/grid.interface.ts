export type TSelectionType = 'single' | 'multiClick' | 'multi' | undefined;

export type TRendererType = Function | Array<any>
  | 'checkboxRenderer'
  | 'dateTimeRenderer'
  | 'phoneRenderer'
  | 'yesNoRenderer';

export interface IGridColumn {
  disabled?: boolean;
  dictCode?: number;
  localized?: boolean;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  prop: string;
  renderer?: Function;
  type?: string;
  // NOTE: technical use only by grid.service.ts, pls do NOT use directly
  $$valueGetter?: Function;
  width?: number;
}

export interface IRenderer {
  [key: string]: TRendererType;
}

export interface IMessages {
  [key: string]: string;
}
