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

import { DYNAMIC_COMPONENT, DYNAMIC_MODULES, DynamicComponentLoaderService } from './dynamic-loader.service';

@NgModule()
export class DynamicLoaderModule {

  // Use ONLY in core module
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicLoaderModule,
      providers: [
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
      ],
    };
  }

  // Use in feature modules that have dynamically loaded modules
  static withModules(modules: IDynamicModule[]): ModuleWithProviders {
    return {
      ngModule: DynamicLoaderModule,
      providers: [
        DynamicComponentLoaderService,
        { provide: ROUTES, useValue: modules, multi: true },
        { provide: DYNAMIC_MODULES, useValue: modules, multi: true},
      ],
    };
  }

  // Use in popup modules that are lazy loaded to specify component
  static withComponent(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: DynamicLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true },
        { provide: DYNAMIC_COMPONENT, useValue: component },
      ],
    };
  }
}
