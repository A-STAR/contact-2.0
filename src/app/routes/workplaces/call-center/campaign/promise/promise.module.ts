import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PromiseComponent } from './promise.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PromiseComponent,
  ],
  declarations: [
    PromiseComponent,
  ],
})
export class PromiseModule { }
