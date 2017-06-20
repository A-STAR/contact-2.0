interface ITreeNode {
    id?: number;
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    bgColor?: string;
    selectedBgColor?: string;
    children?: ITreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: ITreeNode;
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
