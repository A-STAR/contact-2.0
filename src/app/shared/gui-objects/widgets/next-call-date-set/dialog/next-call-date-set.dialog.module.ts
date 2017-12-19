import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// ref
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { NextCallDateSetDialogComponent } from './next-call-date-set.dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    NextCallDateSetDialogComponent,
  ],
  declarations: [
    NextCallDateSetDialogComponent,
  ],
  entryComponents: [
    NextCallDateSetDialogComponent,
  ]
})
export class NextCallDateSetDialogModule { }
