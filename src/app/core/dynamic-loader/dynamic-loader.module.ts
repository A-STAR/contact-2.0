import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  ModuleWithProviders,
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  Type,
} from '@angular/core';
import { ROUTES } from '@angular/router';

import { IDynamicModule } from './dynamic-loader.interface';

import { DYNAMIC_COMPONENT, DynamicComponentLoader } from './dynamic-loader.service';

@NgModule()
export class DynamicComponentLoaderModule {

  // Use ONLY in core module
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        DynamicComponentLoader,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
      ],
    };
  }

  // Use in feature modules to indicate paths of lazy loaded popups
  static withModules(manifests: IDynamicModule[]): ModuleWithProviders {
    DynamicComponentLoader.manifests.push(...manifests);
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ROUTES, useValue: manifests, multi: true },
      ],
    };
  }

  // Use in popup modules that are lazy loaded to specify component
  static withComponent(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true },
        { provide: DYNAMIC_COMPONENT, useValue: component },
      ],
    };
  }
}
