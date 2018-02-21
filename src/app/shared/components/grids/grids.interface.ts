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
  dictCode?: number;
  filter?: IGridFilterType;
  lookupKey?: ILookupKey;
  minWidth?: number;
  maxWidth?: number;
  renderer?: any;
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
