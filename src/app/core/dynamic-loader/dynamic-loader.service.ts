import { ComponentFactory, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicModule } from './dynamic-loader.interface';

import { ComponentFactoryService, DYNAMIC_MODULES } from '@app/core/dynamic-loader/component-factory.service';

@Injectable()
export class DynamicLoaderService {
  constructor(
    private componentFactoryService: ComponentFactoryService,
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
  ) {}

  getComponentFactory<T>(path: string): Observable<ComponentFactory<T>> {
    return this.componentFactoryService.getComponentFactory(path, this.modules);
  }
}
