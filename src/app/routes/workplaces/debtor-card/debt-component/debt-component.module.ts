import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorDebtComponentComponent } from './debt-component.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorDebtComponentComponent,
  ],
  declarations: [
    DebtorDebtComponentComponent,
  ],
})
export class DebtorDebtComponentModule {}
