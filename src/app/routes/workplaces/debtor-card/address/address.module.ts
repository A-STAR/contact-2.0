import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorAddressComponent } from './address.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorAddressComponent
  ],
  declarations: [
    DebtorAddressComponent
  ],
  providers: [],
})
export class DebtorAddressModule { }
