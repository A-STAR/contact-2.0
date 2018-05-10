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
}

export enum DynamicLayoutHorizontalGroupMode {
  NONE      = 'none',
  SPLITTERS = 'splitters',
}

export interface IDynamicLayoutHorizontalGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.HORIZONTAL;
  // Optional:
  mode?: DynamicLayoutHorizontalGroupMode;
}

export enum DynamicLayoutVerticalGroupMode {
  COLLAPSIBLE = 'collapsible',
  NONE        = 'none',
  SPLITTERS   = 'splitters',
}

export interface IDynamicLayoutVerticalGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.VERTICAL;
  // Optional:
  mode?: DynamicLayoutVerticalGroupMode;
}

export interface IDynamicLayoutTabsGroup extends IDynamicLayoutGenericGroup {
  groupType: DynamicLayoutGroupType.TABS;
}

export type IDynamicLayoutGroup =
  | IDynamicLayoutHorizontalGroup
  | IDynamicLayoutVerticalGroup
  | IDynamicLayoutTabsGroup
;
