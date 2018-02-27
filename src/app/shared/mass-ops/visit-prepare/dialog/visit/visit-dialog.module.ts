import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { VisitCardModule } from '../../card/visit-card.module';

import { VisitDialogComponent } from './visit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    VisitCardModule,
  ],
  exports: [
    VisitDialogComponent,
  ],
  declarations: [
    VisitDialogComponent,
  ],
  entryComponents: [
    VisitDialogComponent,
  ]
})
export class VisitDialogModule { }
