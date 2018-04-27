import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../item.interface';

export enum DynamicLayoutControlType {
  TEXT     = 'text',
  TEXTAREA = 'textarea',
}

export interface IDynamicLayoutGenericControl extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.CONTROL;
  controlType: DynamicLayoutControlType;
  name: string;
  // Optional:
  form?: string;
}

export interface IDynamicLayoutTextControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType.TEXT;
}

export interface IDynamicLayoutTextareaControl extends IDynamicLayoutGenericControl {
  controlType: DynamicLayoutControlType;
}

export type IDynamicLayoutControl = IDynamicLayoutTextControl | IDynamicLayoutTextareaControl;
