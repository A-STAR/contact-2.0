import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { SelectModule } from '../../../shared/components/form/select/select.module';

import { PaymentsUploadComponent } from './payments-upload.component';

const routes: Routes = [
  { path: '', component: PaymentsUploadComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SelectModule,
    SharedModule,
  ],
  declarations: [
    PaymentsUploadComponent,
  ],
})
export class PaymentsUploadModule {}
