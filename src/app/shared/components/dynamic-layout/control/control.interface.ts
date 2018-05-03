import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';

export enum DynamicLayoutControlType {
  CHECKBOX   = 'checkbox',
  DATE       = 'date',
  GRIDSELECT = 'gridselect',
  PASSWORD   = 'password',
  SELECT     = 'select',
  TEXT       = 'text',
  TEXTAREA   = 'textarea',
}

export interface IDynamicLayoutGenericControl extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.CONTROL;
  controlType: DynamicLayoutControlType;
  name: string;
  // Optional:
  form?: string;
}

export interface IDynamicLayoutGridSelectControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.GRIDSELECT;
}

export interface IDynamicLayoutTextControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.TEXT;
}

export interface IDynamicLayoutTextareaControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType;
}

export type IDynamicLayoutControl =
  | IDynamicLayoutGridSelectControl
  | IDynamicLayoutTextControl
  | IDynamicLayoutTextareaControl
;
