import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmploymentCardModule } from './card/employment-card.module';
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
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorEmploymentComponent
  ],
})
export class EmploymentModule {}
