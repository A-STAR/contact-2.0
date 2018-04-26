import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';
import { IDynamicLayoutItem } from '.';

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
