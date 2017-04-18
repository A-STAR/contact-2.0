import { EventEmitter } from '@angular/core';

interface SortMeta {
    field: string;
    order: number;
}

interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {[s: string]: FilterMetadata;};
    globalFilter?: any;
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
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
}

interface Confirmation {
    message: string;
    key?: string;
    icon?: string;
    header?: string;
    accept?: Function;
    reject?: Function;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    acceptEvent?: EventEmitter<any>;
    rejectEvent?: EventEmitter<any>;
}

interface BlockableUI {
    getBlockableElement(): HTMLElement;
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
  LazyLoadEvent,
  FilterMetadata,
  MenuItem,
  Message,
  SelectItem,
  TreeNode,
  Confirmation,
  BlockableUI,
  TreeNodeDragEvent
}
