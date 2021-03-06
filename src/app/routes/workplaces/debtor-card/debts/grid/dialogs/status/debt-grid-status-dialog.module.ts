import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../../../shared/components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../../../shared/components/form/dynamic-form/dynamic-form.module';

import { DebtGridStatusDialogComponent } from './debt-grid-status-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
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
