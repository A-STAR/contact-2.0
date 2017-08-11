import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorDebtComponentComponent } from './debt-component.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorDebtComponentComponent
  ],
  declarations: [
    DebtorDebtComponentComponent
  ],
  providers: [],
})
export class DebtorDebtComponentModule { }
