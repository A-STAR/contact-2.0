import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PaymentsComponent } from './payments.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PaymentsComponent,
  ],
  declarations: [
    PaymentsComponent,
  ],
})
export class PaymentsModule { }
