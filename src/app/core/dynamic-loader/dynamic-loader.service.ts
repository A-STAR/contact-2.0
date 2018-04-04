import { ComponentFactory, Injectable, InjectionToken, Injector, NgModuleFactoryLoader } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise as ObservableFromPromise } from 'rxjs/observable/fromPromise';
import { _throw as ObservableThrow } from 'rxjs/observable/throw';

import { IDynamicModule } from './dynamic-loader.interface';

export const DYNAMIC_COMPONENT = new InjectionToken<any>('DYNAMIC_COMPONENT');

@Injectable()
export class DynamicComponentLoader {
  static manifests: IDynamicModule[] = [];

  constructor(
    private loader: NgModuleFactoryLoader,
    private injector: Injector,
  ) { }

  getComponentFactory<T>(componentId: string, injector?: Injector): Observable<ComponentFactory<T>> {
    const manifest = DynamicComponentLoader.manifests.find(m => m.componentId === componentId);
    if (!manifest) {
      return ObservableThrow(`DynamicComponentLoader: Unknown componentId "${componentId}"`);
    }

    const p = this.loader
      .load(manifest.loadChildren)
      .then(ngModuleFactory => {
        const moduleRef = ngModuleFactory.create(injector || this.injector);
        const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT);
        if (!dynamicComponentType) {
          throw new Error(`DynamicComponentLoader: No provider for component "${componentId}".`);
        }
        return moduleRef.componentFactoryResolver.resolveComponentFactory<T>(dynamicComponentType);
      });

    return ObservableFromPromise(p);
  }
}
