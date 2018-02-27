import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { OperatorCardModule } from '../card/operator-card.module';

import { OperatorDialogComponent } from './operator-dialog.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    TranslateModule,
    OperatorCardModule,
  ],
  exports: [
    OperatorDialogComponent,
  ],
  declarations: [
    OperatorDialogComponent,
  ],
  entryComponents: [
    OperatorDialogComponent,
  ]
})
export class OperatorDialogModule { }
