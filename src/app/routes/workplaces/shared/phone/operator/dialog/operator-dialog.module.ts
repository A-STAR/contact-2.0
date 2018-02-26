import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { OperatorDialogComponent } from './operator-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    OperatorDialogComponent,
  ],
  declarations: [
    OperatorDialogComponent,
  ]
})
export class OperatorDialogModule {}
