import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../item.interface';
import { IDynamicLayoutItem } from '../dynamic-layout.interface';

export enum DynamicLayoutGroupType {
  HORIZONTAL = 'horizontal',
  PLAIN      = 'plain',
  TABS       = 'tabs',
  VERTICAL   = 'vertical',
}

export interface IDynamicLayoutGroup extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.GROUP;
  children: IDynamicLayoutItem[];
  groupType?: DynamicLayoutGroupType;
}
