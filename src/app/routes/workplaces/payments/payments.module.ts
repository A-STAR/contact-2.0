import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { PaymentsGridModule } from './payments-grid/payments-grid.module';

const routes: Routes = [
  { path: '', component: PaymentsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaymentsGridModule
  ],
  declarations: [PaymentsComponent]
})
export class PaymentsModule { }
