interface ITreeNode {
    id?: number;
    label?: string;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    bgColor?: string;
    selectedBgColor?: string;
    children?: ITreeNode[];
    expanded?: boolean;
    parent?: ITreeNode;
    data?: any;
    partialSelected?: boolean;
    styleClass?: string;
    selectable?: boolean;
}

export interface ITreeNodeInfo {
  id: number;
  parentId: number;
  sortOrder: number;
}

interface TreeNodeDragEvent {
    tree?: any;
    node?: ITreeNode;
    subNodes?: ITreeNode[];
    index?: number;
    scope?: any;
}

export {
  ITreeNode,
  TreeNodeDragEvent
}
