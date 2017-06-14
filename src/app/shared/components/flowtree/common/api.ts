import { EventEmitter } from '@angular/core';

interface SortMeta {
    field: string;
    order: number;
}

interface FilterMetadata {
    value?: any;
    matchMode?: string;
}

interface MenuItem {
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    eventEmitter?: EventEmitter<any>;
    items?: MenuItem[];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
}

interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
}

interface SelectItem {
    label: string;
    value: any;
}

interface TreeNode {
    id?: number;
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    bgColor?: string;
    selectedBgColor?: string;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode;
    partialSelected?: boolean;
    styleClass?: string;
    selectable?: boolean;
}

interface TreeNodeDragEvent {
    tree?: any;
    node?: TreeNode;
    subNodes?: TreeNode[];
    index?: number;
    scope?: any;
}

export {
  SortMeta,
  FilterMetadata,
  MenuItem,
  Message,
  SelectItem,
  TreeNode,
  TreeNodeDragEvent
}
