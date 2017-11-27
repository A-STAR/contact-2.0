import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { DialogActionModule } from '../../../../../components/dialog-action/dialog-action.module';

import { OperatorRejectDialogComponent } from './operator-reject-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    ResultDialogModule,
    TranslateModule,
  ],
  exports: [
    OperatorRejectDialogComponent,
  ],
  declarations: [
    OperatorRejectDialogComponent,
  ],
  entryComponents: [
    OperatorRejectDialogComponent,
  ]
})
export class OperatorRejectDialogModule { }
