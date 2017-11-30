import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { OperatorModule } from '../../../operator/operator.module';

import { DebtResponsibleSetComponent } from './debt-responsible-set.component';

@NgModule({
  imports: [
    CommonModule,
    ResultDialogModule,
    OperatorModule,
  ],
  exports: [
    DebtResponsibleSetComponent,
  ],
  declarations: [
    DebtResponsibleSetComponent,
  ],
  entryComponents: [
    DebtResponsibleSetComponent,
  ]
})
export class DebtResponsibleSetModule { }
