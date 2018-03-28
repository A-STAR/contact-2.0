import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmploymentCardModule } from '@app/routes/workplaces/debtor-card/employment/card/employment-card.module';
import { EmploymentGridModule } from '@app/routes/workplaces/debtor-card/employment/grid/employment-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmploymentComponent } from './employment.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorEmploymentComponent,
  }
];

@NgModule({
  imports: [
    EmploymentCardModule,
    EmploymentGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
    EmploymentGridModule,
  ],
  declarations: [
    DebtorEmploymentComponent
  ],
})
export class EmploymentModule {}
