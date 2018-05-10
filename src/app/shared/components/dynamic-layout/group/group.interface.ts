import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';
import { IDynamicLayoutItem } from '../dynamic-layout.interface';

export enum DynamicLayoutGroupType {
  HORIZONTAL = 'horizontal',
  VERTICAL   = 'vertical',
  TABS       = 'tabs',
}

export interface IDynamicLayoutGenericGroup extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.GROUP;
  groupType: DynamicLayoutGroupType;
  children: IDynamicLayoutItem[];
  // Optional:
  collapsible?: boolean;
}

export enum DynamicLayoutGroupMode {
  NONE      = 'none',
  SPLITTERS = 'splitters',
}

export interface IDynamicLayoutHorizontalGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.HORIZONTAL;
  // Optional:
  mode?: DynamicLayoutGroupMode;
}

export interface IDynamicLayoutVerticalGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.VERTICAL;
  // Optional:
  mode?: DynamicLayoutGroupMode;
}

export interface IDynamicLayoutTabsGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.TABS;
}

export type IDynamicLayoutGroup =
  | IDynamicLayoutHorizontalGroup
  | IDynamicLayoutVerticalGroup
  | IDynamicLayoutTabsGroup
;
