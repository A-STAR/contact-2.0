import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
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

export interface IDynamicLayoutSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.SELECT;
  options?: IOption[];
  dictCode?: number;
  lookupKey?: ILookupKey;
}

export interface IDynamicLayoutDialogSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.DIALOGSELECT;
}

export interface IDynamicLayoutMultiSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.MULTISELECT;
}

export interface IDynamicLayoutDateTimeControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.DATETIME;
}

export interface IDynamicLayoutNumberControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.NUMBER;
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
  | IDynamicLayoutSelectControl
  | IDynamicLayoutDialogSelectControl
  | IDynamicLayoutDateTimeControl
  | IDynamicLayoutGridSelectControl
  | IDynamicLayoutMultiSelectControl
  | IDynamicLayoutNumberControl
  | IDynamicLayoutTextControl
  | IDynamicLayoutTextareaControl
;
