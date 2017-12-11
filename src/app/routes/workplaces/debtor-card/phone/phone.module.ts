import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorPhoneComponent } from './phone.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPhoneComponent
  ],
  declarations: [
    DebtorPhoneComponent
  ],
  providers: [],
})
export class DebtorPhoneModule { }
