import {
  Injectable,
  ComponentFactoryResolver,
  Injector,
  TemplateRef,
  Type,
  ApplicationRef,
} from '@angular/core';

import { IMapComponent, IMapComponentRenderResult } from './map-renderer.interface';

@Injectable()
export class MapRendererService {

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
  ) { }

  render<T extends IMapComponent>(cmp: Type<T>, data: any, tpl?: TemplateRef<any>): IMapComponentRenderResult<T> {

    const compFactory = this.resolver.resolveComponentFactory<T>(cmp);
    const divEl = document.createElement('div');
    const compRef = compFactory.create(this.injector, null, divEl);
    this.appRef.attachView(compRef.hostView);

    compRef.instance.context = { data };
    compRef.instance.tpl = tpl;

    return { compRef, el: divEl };
  }

}
