import { Injector } from '@angular/core';

import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';

export interface IPopup {
  id: string;
  modules: IDynamicModule[];
  injector: Injector;
}
