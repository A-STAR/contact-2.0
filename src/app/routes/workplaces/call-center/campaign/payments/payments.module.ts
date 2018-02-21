import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PaymentsComponent } from './payments.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PaymentsComponent,
  ],
  declarations: [
    PaymentsComponent,
  ],
})
export class PaymentsModule {}
