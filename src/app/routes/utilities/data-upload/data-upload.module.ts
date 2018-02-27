import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { CellRendererComponent } from './cell-renderer.component';
import { DataUploadComponent } from './data-upload.component';

const routes: Routes = [
  {
    path: '',
    component: DataUploadComponent,
    data: {
      reuse: true,
    },
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    CellRendererComponent,
  ],
  declarations: [
    CellRendererComponent,
    DataUploadComponent,
  ],
  entryComponents: [
    CellRendererComponent,
  ],
})
export class DataUploadModule {}
