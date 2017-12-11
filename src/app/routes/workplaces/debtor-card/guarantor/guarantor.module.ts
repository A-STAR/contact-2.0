import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorGuarantorComponent } from './guarantor.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorGuarantorComponent
  ],
  declarations: [
    DebtorGuarantorComponent
  ],
})
export class DebtorGuarantorModule {}
