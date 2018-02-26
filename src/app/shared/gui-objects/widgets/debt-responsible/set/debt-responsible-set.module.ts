import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtResponsibleSetDialogModule } from './dialog/debt-responsible-set-dialog.module';

import { DebtResponsibleSetService } from './debt-responsible-set.service';

import { DebtResponsibleSetComponent } from './debt-responsible-set.component';

@NgModule({
  imports: [
    CommonModule,
    DebtResponsibleSetDialogModule,
  ],
  declarations: [ DebtResponsibleSetComponent ],
  exports: [
    DebtResponsibleSetComponent,
    DebtResponsibleSetDialogModule,
  ],
  providers: [
    DebtResponsibleSetService,
  ]
})
export class DebtResponsibleSetModule { }
