import { NgModule } from '@angular/core';

import { EmploymentCardModule } from '@app/routes/workplaces/debtor-card/employment/card/employment-card.module';
import { EmploymentGridModule } from '@app/routes/workplaces/debtor-card/employment/grid/employment-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmploymentComponent } from './employment.component';

@NgModule({
  imports: [
    EmploymentCardModule,
    EmploymentGridModule,
    SharedModule,
  ],
  exports: [
    DebtorEmploymentComponent,
    EmploymentGridModule,
  ],
  declarations: [
    DebtorEmploymentComponent
  ],
})
export class DebtorEmploymentModule {}
