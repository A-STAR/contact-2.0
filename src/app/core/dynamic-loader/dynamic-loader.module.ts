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

import { DYNAMIC_MODULES, DYNAMIC_COMPONENT, DynamicLoaderService } from './dynamic-loader.service';
import { PopupOutletService } from './popup-outlet.service';

@NgModule()
export class DynamicLoaderModule {

  // Use ONLY in core module
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicLoaderModule,
      providers: [
        PopupOutletService,
        DynamicLoaderService,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
      ],
    };
  }

  // Use in feature modules that have dynamically loaded modules
  //
  // Note:
  // Because lazy modules create their own DI branches, we have to provide DynamicLoaderService here instead of `forRoot` method.
  // Otherwise, DynamicLoaderService wouldn't get DYNAMIC_MODULES from its injector.
  //
  // For lazy modules this means that it is possible to load only those dynamic submodules
  // that are listed in their `DynamicLoaderModule.withModules([...])`.
  static withModules(modules: IDynamicModule[]): ModuleWithProviders {
    return {
      ngModule: DynamicLoaderModule,
      providers: [
        { provide: ROUTES, useValue: modules, multi: true },
        { provide: DYNAMIC_MODULES, useValue: modules, multi: true },
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
