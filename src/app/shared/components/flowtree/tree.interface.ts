export interface IClickableComponentPlugin {
  delegateClick(event: MouseEvent): void;
  stopEvent(event: MouseEvent): void;
}

export interface IClickableComponent extends IClickableComponentPlugin {
  onClick(event: MouseEvent): void;
  onDoubleClick(event: MouseEvent): void;
}
