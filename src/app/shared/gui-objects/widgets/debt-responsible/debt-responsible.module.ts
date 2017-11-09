import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtResponsibleSetModule } from './dialog/set/debt-responsible-set.module';

import { DebtResponsibleService } from './debt-responsible.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DebtResponsibleSetModule,
  ],
  providers: [
    DebtResponsibleService,
  ]
})
export class DebtResponsibleModule { }
