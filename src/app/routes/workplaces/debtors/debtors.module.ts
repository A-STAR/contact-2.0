import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DebtorsComponent } from './debtors.component';

const routes: Routes = [
  { path: '', component: DebtorsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DebtorsComponent,
  ],
})
export class DebtorsModule {}
