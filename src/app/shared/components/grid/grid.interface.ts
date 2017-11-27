import { ILookupKey } from '../../../core/lookup/lookup.interface';
import { Observable } from 'rxjs/Observable';

export type TSelectionType = 'single' | 'multiClick' | 'multi' | undefined;

export type TColumnType =
    'text'
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  ;

export type TRendererType = Function | Array<any>
  | 'checkboxRenderer'
  | 'dateRenderer'
  | 'dateTimeRenderer'
  | 'numberRenderer'
  | 'phoneRenderer'
  | 'yesNoRenderer'
  ;

export interface IGridColumn {
  disabled?: boolean;
  dictCode?: number;
  lookupKey?: ILookupKey;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  prop: string;
  renderer?: Function | TRendererType;
  type?: TColumnType;
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

export interface IContextMenuItem {
  enabled: Observable<boolean>;
  action: (action: any) => any;
  prop?: string;
  name?: string;
  fieldActions?: string[];
  fieldAction?: string;
  translationKey?: string;
  icon?: HTMLElement | string;
  cssClasses?: string[];
}
