import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

export enum DynamicLayoutControlType {
  CHECKBOX        = 'checkbox',
  DATE            = 'date',
  DATETIME        = 'datetimepicker',
  DIALOGSELECT    = 'dialogmultiselect',
  GRIDSELECT      = 'gridselect',
  PASSWORD        = 'password',
  SELECT          = 'select',
  MULTISELECT     = 'multiselect',
  TEXT            = 'text',
  NUMBER          = 'number',
  TEXTAREA        = 'textarea',
}

export interface IDynamicLayoutGenericControl extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.CONTROL;
  controlType: DynamicLayoutControlType;
  name: string;
  // Optional:
  form?: string;
}

export interface IDynamicLayoutDialogSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.GRIDSELECT;
}

export interface IDynamicLayoutGridSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.GRIDSELECT;
  // Optional:
  dictCode?: number;
  lookupKey?: ILookupKey;
}

export interface IDynamicLayoutTextControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.TEXT;
}

export interface IDynamicLayoutTextareaControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType;
}

export type IDynamicLayoutControl =
  | IDynamicLayoutDialogSelectControl
  | IDynamicLayoutGridSelectControl
  | IDynamicLayoutTextControl
  | IDynamicLayoutTextareaControl
;
