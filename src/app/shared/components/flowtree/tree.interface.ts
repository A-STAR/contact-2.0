import { OnDestroy } from '@angular/core';

export interface IClickableComponentPlugin extends OnDestroy {
  delegateClick(event: MouseEvent): void;
  ngOnDestroy(): void;
}

export interface IClickableComponent extends IClickableComponentPlugin {
  onClick(event: MouseEvent): void;
  onDoubleClick(event: MouseEvent): void;
}
