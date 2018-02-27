import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';

import { VisitCancelDialogComponent } from './visit-cancel-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    TranslateModule,
  ],
  exports: [
    VisitCancelDialogComponent,
  ],
  declarations: [
    VisitCancelDialogComponent,
  ],
  entryComponents: [
    VisitCancelDialogComponent,
  ]
})
export class VisitCancelDialogModule { }
