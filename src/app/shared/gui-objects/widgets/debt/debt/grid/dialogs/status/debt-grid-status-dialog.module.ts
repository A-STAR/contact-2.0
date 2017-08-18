import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../../../components/dialog/dialog.module';
import { DynamicForm2Module } from '../../../../../../../components/form/dynamic-form-2/dynamic-form-2.module';

import { DebtGridStatusDialogComponent } from './debt-grid-status-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicForm2Module,
    TranslateModule,
  ],
  exports: [
    DebtGridStatusDialogComponent,
  ],
  declarations: [
    DebtGridStatusDialogComponent,
  ]
})
export class DebtGridStatusDialogModule { }
