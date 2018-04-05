import { ComponentFactory, Injectable, InjectionToken, Injector, NgModuleFactoryLoader } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { _throw } from 'rxjs/observable/throw';

import { IDynamicModule } from './dynamic-loader.interface';

import { flattenArray } from '@app/core/utils';

export const DYNAMIC_COMPONENT = new InjectionToken<any>('DYNAMIC_COMPONENT');

export const DYNAMIC_MODULES = new InjectionToken<any>('DYNAMIC_MODULES');

@Injectable()
export class ComponentFactoryService {
  constructor(
    private injector: Injector,
    private loader: NgModuleFactoryLoader,
  ) {}

  getComponentFactory<T>(path: string, dynamicModules: IDynamicModule[][]): Observable<ComponentFactory<T>> {
    const dynamicModule = flattenArray(dynamicModules).find(m => m.path === path);

    if (!dynamicModule) {
      return _throw(`DynamicComponentLoader: Unknown component "${dynamicModule.path}"`);
    }

    const p = this.loader
      .load(dynamicModule.loadChildren)
      .then(ngModuleFactory => {
        const moduleRef = ngModuleFactory.create(this.injector);
        const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT);
        if (!dynamicComponentType) {
          throw new Error(`DynamicComponentLoader: No provider for component "${dynamicModule.path}".`);
        }
        return moduleRef.componentFactoryResolver.resolveComponentFactory<T>(dynamicComponentType);
      });

    return fromPromise(p);
  }
}
