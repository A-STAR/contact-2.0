import { Injectable, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';

@Injectable()
export class PopupService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) { }

  render<T extends { data?: any }>(cmp: any, data: any): { el: HTMLElement, compRef: ComponentRef<T> } {
    const compFactory = this.resolver.resolveComponentFactory<T>(cmp);
    const compRef = compFactory.create(this.injector);
    compRef.instance.data = data;
    const divEl = document.createElement('div');
    divEl.appendChild(compRef.location.nativeElement);
    return { compRef, el: divEl };
  }

}
