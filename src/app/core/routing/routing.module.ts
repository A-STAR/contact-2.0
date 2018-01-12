import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { RoutingService } from './routing.service';

import { ReuseStrategy } from './reuse-strategy';

@NgModule({
  providers: [
    RoutingService,
    { provide: RouteReuseStrategy, useClass: ReuseStrategy },
  ],
})
export class RoutingModule {}
