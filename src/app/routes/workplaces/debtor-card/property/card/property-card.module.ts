import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorPropertyCardComponent } from './property-card.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorPropertyCardComponent,
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
    DebtorPropertyCardComponent,
  ]
})
export class PropertyCardModule {}
