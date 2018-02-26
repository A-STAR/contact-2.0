import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorDialogModule } from './dialog/operator-dialog.module';

import { OperatorService } from './operator.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    OperatorDialogModule,
  ],
  providers: [
    OperatorService,
  ]
})
export class OperatorModule { }
