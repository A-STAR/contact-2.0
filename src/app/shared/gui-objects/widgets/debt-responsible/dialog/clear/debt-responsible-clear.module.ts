import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { OperatorModule } from '../../../operator/operator.module';

import { DebtResponsibleClearComponent } from './debt-responsible-clear.component';

@NgModule({
  imports: [
    CommonModule,
    ResultDialogModule,
    OperatorModule,
  ],
  exports: [
    DebtResponsibleClearComponent,
  ],
  declarations: [
    DebtResponsibleClearComponent,
  ],
  entryComponents: [
    DebtResponsibleClearComponent,
  ]
})
export class DebtResponsibleClearModule { }
