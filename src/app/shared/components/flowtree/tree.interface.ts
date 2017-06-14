export interface ITreeNodeInfo {
  id: number;
  parentId: number;
  sortOrder: number;
}

export interface IClickableComponentPlugin {
  delegateClick(event: MouseEvent): void;
}

export interface IClickableComponent extends IClickableComponentPlugin {
  onClick(event: MouseEvent): void;
  onDoubleClick(event: MouseEvent): void;
}
