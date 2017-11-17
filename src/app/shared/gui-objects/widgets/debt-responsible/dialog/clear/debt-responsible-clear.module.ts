import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { OperatorModule } from '../../../operator/operator.module';

import { DebtResponsibleClearComponent } from './debt-responsible-clear.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    ResultDialogModule,
    OperatorModule,
    TranslateModule,
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
