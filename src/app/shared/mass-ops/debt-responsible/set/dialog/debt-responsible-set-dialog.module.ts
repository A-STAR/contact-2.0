import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DebtResponsibleSetGridModule } from '../grid/debt-responsible-set-grid.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';

import { DebtResponsibleSetDialogComponent } from './debt-responsible-set-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DebtResponsibleSetGridModule,
    DialogModule,
  ],
  exports: [
    DebtResponsibleSetDialogComponent,
    DebtResponsibleSetGridModule,
  ],
  declarations: [
    DebtResponsibleSetDialogComponent,
  ],
})
export class DebtResponsibleSetDialogModule { }
