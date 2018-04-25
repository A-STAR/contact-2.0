import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';
import { IDynamicLayoutItem } from '.';

export enum DynamicLayoutGroupType {
  PLAIN = 'plain',
  TABS  = 'tabs',
}

export interface IDynamicLayoutGroup extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.GROUP;
  children: IDynamicLayoutItem[];
  groupType?: DynamicLayoutGroupType;
}
