import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { PaymentsUploadComponent } from './payments-upload.component';

const routes: Routes = [
  { path: '', component: PaymentsUploadComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    PaymentsUploadComponent,
  ],
})
export class PaymentsUploadModule {}
