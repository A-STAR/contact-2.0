import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../dialog.module';

import { ResultDialogComponent } from './result-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    ResultDialogComponent,
  ],
  declarations: [
    ResultDialogComponent,
  ],
})
export class ResultDialogModule { }
