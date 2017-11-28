import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DataUploadComponent } from './data-upload.component';

const routes: Routes = [
  { path: '', component: DataUploadComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DataUploadComponent,
  ],
})
export class DataUploadModule {}
