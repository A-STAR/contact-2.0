import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PromisesComponent } from './promises.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PromisesComponent,
  ],
  declarations: [
    PromisesComponent,
  ],
})
export class PromisesModule { }
