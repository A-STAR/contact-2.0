import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';

export interface IDynamicLayoutField extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.FIELD;
}
