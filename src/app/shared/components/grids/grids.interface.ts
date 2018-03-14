import { ICellRendererParams, ICellEditorParams } from 'ag-grid';
import { ValueGetterParams, ValueSetterParams, ValueParserParams } from 'ag-grid/dist/lib/entities/colDef';

import { ILookupKey } from '@app/core/lookup/lookup.interface';

export enum IGridSelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum IGridFilterType {
  TEXT,
  NUMBER,
  DATE,
}

export type IDictCodeCallback<T> = (item: T) => number;
export type IRendererCallback<T> = (item: T) => string;
export type IRendererCallbackParams = ICellRendererParams & { rendererCallback: IRendererCallback<any>};

/**
 * Base grid column interface for `ISimpleGridColumn` and others to extend
 *
 * T is type of row data
 */
export interface IGridColumn<T> {

  // Mandatory Fields
  label: string;
  prop: keyof T;

  // Optional Fields
  dictCode?: number | IDictCodeCallback<T>;
  rendererCallback?: IRendererCallback<T>;
  filter?: IGridFilterType;
  lookupKey?: ILookupKey;
  minWidth?: number;
  maxWidth?: number;
  renderer?: any;
  valueTypeKey?: string;
  // params for value renderer
  valueTypeParams?: {
    dictCode?: number | IDictCodeCallback<T>;
    lookupKey?: ILookupKey;
  };
  valueGetter?: ((params: ValueGetterParams) => any) | string;
  valueSetter?: ((params: ValueSetterParams) => boolean) | string;
  valueParser?: ((params: ValueParserParams) => any);
  isGroup?: boolean;
  edit?: IGridEditableColumn<T>;
}

export interface IGridEditableColumn<T> {
  editable: boolean | ((params: ValueGetterParams) => boolean);
  dictCode?: number | IDictCodeCallback<T>;
  lookupKey?: ILookupKey;
}

export interface IGridTreePath {
  path: string[];
  name: string;
  children?: any[];
}

export interface IGridLocalSettingsColumn {
  colId: string;
  isVisible: boolean;
  width: number;
}

export interface IGridLocalSettings {
  columns: IGridLocalSettingsColumn[];
  sortModel: any;
}

export interface IValueRendererDef {
  valueTypeKey: string;
  valueTypeParams?: {
    dictCode?: number | IDictCodeCallback<any>;
    lookupKey?: ILookupKey;
  };
}

export type IValueRendererParams = ICellRendererParams & IValueRendererDef & { data: any };

export type IValueEditorParams = IGridEditableColumn<any> & ICellEditorParams & { valueTypeKey: string };
