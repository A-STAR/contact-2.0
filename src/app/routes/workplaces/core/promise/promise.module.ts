import { NgModule } from '@angular/core';

import { PromiseService } from './promise.service';

@NgModule({
  providers: [
    PromiseService,
  ],
})
export class PromiseModule {}
