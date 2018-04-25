import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { EmploymentCardComponent } from './employment-card.component';

const routes: Routes = [
  {
    path: '',
    component: EmploymentCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    EmploymentCardComponent,
  ]
})
export class EmploymentCardModule {}
