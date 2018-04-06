import { Injectable, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';

@Injectable()
export class PopupService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) { }

  render<T extends { data?: any }>(cmp: any, data: any): { el: HTMLElement, compRef: ComponentRef<T> } {
    const compFactory = this.resolver.resolveComponentFactory<T>(cmp);
    const divEl = document.createElement('div');
    // prevent google InfoGroup scrolls
    divEl.style.overflow = 'hidden';
    const compRef = compFactory.create(this.injector, null, divEl);
    compRef.instance.data = data;
    return { compRef, el: divEl };
  }

}
