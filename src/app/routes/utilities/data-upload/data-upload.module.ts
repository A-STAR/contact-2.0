import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { SelectModule } from '../../../shared/components/form/select/select.module';

import { DataUploadComponent } from './data-upload.component';

const routes: Routes = [
  { path: '', component: DataUploadComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SelectModule,
    SharedModule,
  ],
  declarations: [
    DataUploadComponent,
  ],
})
export class DataUploadModule {}
