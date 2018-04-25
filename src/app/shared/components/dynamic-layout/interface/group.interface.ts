import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';

export enum DynamicLayoutGroupType {
  PLAIN = 'plain',
  TABS  = 'tabs',
}

export interface IDynamicLayoutGroup extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.GROUP;
}
