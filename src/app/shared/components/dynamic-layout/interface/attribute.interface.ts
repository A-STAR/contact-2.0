import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';

export interface IDynamicLayoutAttribute extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.ATTRIBUTE;
}
