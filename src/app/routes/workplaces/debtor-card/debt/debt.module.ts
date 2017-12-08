import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorDebtComponent } from './debt.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorDebtComponent
  ],
  declarations: [
    DebtorDebtComponent
  ],
  providers: [],
})
export class DebtorDebtModule { }
