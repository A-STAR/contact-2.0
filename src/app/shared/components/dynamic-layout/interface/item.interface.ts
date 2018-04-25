import { IContext } from './context.interface';

export enum DynamicLayoutItemType {
  CONTROL  = 'control',
  GROUP    = 'group',
  TEMPLATE = 'template',
}

export interface IDynamicLayoutGenericItem {
  display: IContext;
  type: DynamicLayoutItemType;
}
