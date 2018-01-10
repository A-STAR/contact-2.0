import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsGridModule } from './payments-grid/payments-grid.module';

import { PaymentsService } from './payments.service';

import { PaymentsComponent } from './payments.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaymentsGridModule
  ],
  providers: [ PaymentsService ],
  declarations: [PaymentsComponent]
})
export class PaymentsModule { }
