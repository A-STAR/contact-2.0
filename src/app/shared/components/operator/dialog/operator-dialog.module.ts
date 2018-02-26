import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { OperatorDialogComponent } from './operator-dialog.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  exports: [
    OperatorDialogComponent,
  ],
  declarations: [
    OperatorDialogComponent,
  ]
})
export class OperatorDialogModule {}
