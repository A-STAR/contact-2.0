import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorDebtComponentComponent } from './debt-component.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorDebtComponentComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorDebtComponentComponent,
  ],
})
export class DebtComponentModule {}
