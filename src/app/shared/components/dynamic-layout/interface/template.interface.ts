import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';

export interface IDynamicLayoutTemplate extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.TEMPLATE;
  value: string;
}
