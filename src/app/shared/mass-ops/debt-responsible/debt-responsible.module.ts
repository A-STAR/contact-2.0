import { NgModule } from '@angular/core';

import { DebtResponsibleClearModule } from './clear/debt-responsible-clear.module';
import { DebtResponsibleSetModule } from './set/debt-responsible-set.module';

import { DebtResponsibleService } from './debt-responsible.service';

@NgModule({
  imports: [
    DebtResponsibleClearModule,
    DebtResponsibleSetModule,
  ],
  exports: [
    DebtResponsibleClearModule,
    DebtResponsibleSetModule,
  ],
  providers: [
    DebtResponsibleService,
  ]
})
export class DebtResponsibleModule { }
