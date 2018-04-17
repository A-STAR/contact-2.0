import { TemplateRef, ComponentRef } from '@angular/core';

export interface IMapComponent {
  context: any;
  tpl?: TemplateRef<any>;
}

export interface IMapComponentRenderResult<T> {
  el: HTMLElement;
  compRef: ComponentRef<T>;
}
