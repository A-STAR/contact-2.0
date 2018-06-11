import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';

export interface IDynamicLayoutTemplate extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.TEMPLATE;
  value: string;
  context?: any;
}
