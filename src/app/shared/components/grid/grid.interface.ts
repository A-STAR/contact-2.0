import { ILookupKey } from '../../../core/lookup/lookup.interface';
import { Observable } from 'rxjs/Observable';

import { IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction, IMetadataTitlebar } from '@app/core/metadata/metadata.interface';

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
  action?: string | ((action: any) => any);
  prop?: string;
  label?: string;
  simpleActionsNames?: string[];
  simpleActionName?: string;
  translationKey?: string;
  icon?: HTMLElement | string;
  cssClasses?: string[];
  params?: string[];
  submenu?: IContextMenuItem[];
  addOptions?: { name: string; value: Array<number|string> }[];
  // these are internal collections
  actions?: IContextMenuItem[];
  simpleActions?: IContextMenuItem[];
}

export interface IMetadataDefs {
  actions: IMetadataAction[];
  columns: IAGridColumn[];
  titlebar?: IMetadataTitlebar;
}
