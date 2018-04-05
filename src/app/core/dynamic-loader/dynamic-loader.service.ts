import { ComponentFactory, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ComponentFactoryService, DYNAMIC_MODULES } from '@app/core/dynamic-loader/component-factory.service';

@Injectable()
export class DynamicLoaderService {
  constructor(
    private componentFactoryService: ComponentFactoryService,
    private injector: Injector,
  ) {}

  getComponentFactory<T>(path: string): Observable<ComponentFactory<T>> {
    return this.componentFactoryService.getComponentFactory(path, this.injector.get(DYNAMIC_MODULES));
  }
}
