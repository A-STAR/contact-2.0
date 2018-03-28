import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GuarantorModule } from '../guarantor/guarantor.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorGuaranteeCardComponent } from './guarantee-card.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorGuaranteeCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    GuarantorModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorGuaranteeCardComponent,
  ]
})
export class GuaranteeCardModule {}
