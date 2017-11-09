import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { OperatorModule } from '../../../operator/operator.module';

import { DebtResponsibleSetComponent } from './debt-responsible-set.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    OperatorModule,
    TranslateModule,
  ],
  exports: [
    DebtResponsibleSetComponent,
  ],
  declarations: [
    DebtResponsibleSetComponent,
  ],
  entryComponents: [
    DebtResponsibleSetComponent,
  ]
})
export class DebtResponsibleSetModule { }
