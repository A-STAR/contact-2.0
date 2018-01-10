import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { ReuseStrategy } from './reuse-strategy';

@NgModule({
  providers: [
    { provide: RouteReuseStrategy, useClass: ReuseStrategy },
  ],
})
export class RoutingModule {}
