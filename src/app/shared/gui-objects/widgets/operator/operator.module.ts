import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorGridModule } from './grid/operator-grid.module';
import { OperatorDialogModule } from './dialog/operator-dialog.module';

import { OperatorService } from './operator.service';

@NgModule({
  imports: [
    OperatorGridModule,
    CommonModule,
  ],
  exports: [
    OperatorGridModule,
    OperatorDialogModule,
  ],
  providers: [
    OperatorService,
  ]
})
export class OperatorModule { }