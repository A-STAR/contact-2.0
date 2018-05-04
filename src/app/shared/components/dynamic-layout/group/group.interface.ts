import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';
import { IDynamicLayoutItem } from '../dynamic-layout.interface';

export enum DynamicLayoutGroupType {
  HORIZONTAL = 'horizontal',
  VERTICAL   = 'vertical',
  TABS       = 'tabs',
}

export interface IDynamicLayoutGenericGroup extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.GROUP;
  children: IDynamicLayoutItem[];
  // Optional:
  grow?: boolean;
}

export interface IDynamicLayoutTabsGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.TABS;
}

export interface IDynamicLayoutPlainGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.HORIZONTAL | DynamicLayoutGroupType.VERTICAL;
  // Optional:
  splitters?: boolean;
}

export type IDynamicLayoutGroup = IDynamicLayoutTabsGroup | IDynamicLayoutPlainGroup;
