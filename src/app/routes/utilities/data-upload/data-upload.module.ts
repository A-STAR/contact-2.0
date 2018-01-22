import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';
import { SelectModule } from '../../../shared/components/form/select/select.module';

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
    SelectModule,
    SharedModule,
    TranslateModule,
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
