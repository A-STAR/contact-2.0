import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAddressComponent } from './address.component';

@NgModule({
  imports: [
    SharedModule,
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
