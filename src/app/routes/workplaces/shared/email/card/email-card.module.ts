import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmailCardComponent } from './email-card.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorEmailCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    DebtorEmailCardComponent,
  ],
  declarations: [
    DebtorEmailCardComponent,
  ],
})
export class EmailCardModule {}
