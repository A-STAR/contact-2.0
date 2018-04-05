import { ComponentFactory, Injectable, InjectionToken, Injector, NgModuleFactoryLoader } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise as ObservableFromPromise } from 'rxjs/observable/fromPromise';
import { _throw as ObservableThrow } from 'rxjs/observable/throw';

import { IDynamicModule } from './dynamic-loader.interface';

import { flattenArray } from '@app/core/utils';

export const DYNAMIC_COMPONENT = new InjectionToken<any>('DYNAMIC_COMPONENT');

export const DYNAMIC_MODULES = new InjectionToken<any>('DYNAMIC_MODULES');

@Injectable()
export class DynamicComponentLoader {
  static manifests: IDynamicModule[] = [];

  constructor(
    private loader: NgModuleFactoryLoader,
    private injector: Injector,
  ) { }

  getComponentFactory<T>(path: string, injector?: Injector): Observable<ComponentFactory<T>> {
    const dynamicModules = this.injector.get(DYNAMIC_MODULES);

    const dynamicModule = flattenArray(dynamicModules).find(m => m.path === path);
    if (!dynamicModule) {
      return ObservableThrow(`DynamicComponentLoader: Unknown component "${path}"`);
    }

    const p = this.loader
      .load(dynamicModule.loadChildren)
      .then(ngModuleFactory => {
        const moduleRef = ngModuleFactory.create(injector || this.injector);
        const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT);
        if (!dynamicComponentType) {
          throw new Error(`DynamicComponentLoader: No provider for component "${path}".`);
        }
        return moduleRef.componentFactoryResolver.resolveComponentFactory<T>(dynamicComponentType);
      });

    return ObservableFromPromise(p);
  }
}
