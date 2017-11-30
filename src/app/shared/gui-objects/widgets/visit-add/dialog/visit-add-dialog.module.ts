import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { ResultDialogModule } from '../../../../components/dialog/result/result-dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';


import { VisitAddDialogComponent } from './visit-add-dialog.component';


@NgModule({
  imports: [
    DialogModule,
    DialogActionModule,
    TranslateModule,
    CommonModule,
    ResultDialogModule,
    DynamicFormModule
  ],
  exports: [
    VisitAddDialogComponent,
  ],
  declarations: [
    VisitAddDialogComponent,
  ]
})
export class VisitAddDialogModule { }
