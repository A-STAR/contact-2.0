import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../../shared/shared.module';

import { StatusDialogComponent } from './status-dialog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    StatusDialogComponent,
  ],
  declarations: [
    StatusDialogComponent,
  ],
})
export class StatusDialogModule { }
