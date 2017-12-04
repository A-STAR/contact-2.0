import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtResponsibleSetModule } from './dialog/set/debt-responsible-set.module';
import { DebtResponsibleClearModule } from './dialog/clear/debt-responsible-clear.module';

import { DebtResponsibleService } from './debt-responsible.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DebtResponsibleSetModule,
    DebtResponsibleClearModule,
  ],
  providers: [
    DebtResponsibleService,
  ]
})
export class DebtResponsibleModule { }
