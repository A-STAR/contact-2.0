import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../components/dialog-action/dialog-action.module';
import { OperatorModule } from '../operator/operator.module';

import { DebtResponsibleService } from './debt-responsible.service';

import { DebtResponsibleClearComponent } from './dialog/clear/debt-responsible-clear.component';
import { DebtResponsibleSetComponent } from './dialog/set/debt-responsible-set.component';


@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    OperatorModule,
  ],
  declarations: [
    DebtResponsibleSetComponent,
    DebtResponsibleClearComponent
  ],
  exports: [
    DebtResponsibleSetComponent,
    DebtResponsibleClearComponent
  ],
  providers: [
    DebtResponsibleService,
  ]
})
export class DebtResponsibleModule { }
