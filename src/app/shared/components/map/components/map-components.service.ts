import {
  Injectable,
  ComponentFactoryResolver,
  Injector,
  TemplateRef,
  Type,
} from '@angular/core';

import { IMapComponent, IMapComponentRenderResult } from '@app/shared/components/map/components/map-components.interface';

@Injectable()
export class MapComponentsService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) { }

  render<T extends IMapComponent>(cmp: Type<T>, data: any, tpl?: TemplateRef<any>): IMapComponentRenderResult<T> {

    const compFactory = this.resolver.resolveComponentFactory<T>(cmp);
    const divEl = document.createElement('div');
    const compRef = compFactory.create(this.injector, null, divEl);

    compRef.instance.context = { data };
    compRef.instance.tpl = tpl;

    return { compRef, el: divEl };
  }

}
