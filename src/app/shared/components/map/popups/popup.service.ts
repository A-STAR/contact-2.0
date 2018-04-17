import { Injectable, ComponentFactoryResolver, Injector, ComponentRef, TemplateRef } from '@angular/core';

@Injectable()
export class PopupService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) { }

  render<T extends { context?: any, tpl?:  TemplateRef<any> }>(cmp: any, data: any, tpl?: TemplateRef<any>)
    : { el: HTMLElement, compRef: ComponentRef<T> } {
    const compFactory = this.resolver.resolveComponentFactory<T>(cmp);
    const divEl = document.createElement('div');
    // prevent google InfoGroup scrolls
    divEl.style.overflow = 'hidden';
    const compRef = compFactory.create(this.injector, null, divEl);
    compRef.instance.context = { data };
    compRef.instance.tpl = tpl;
    return { compRef, el: divEl };
  }

}
