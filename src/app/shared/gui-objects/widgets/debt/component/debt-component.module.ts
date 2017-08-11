import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtComponentCardModule } from './card/debt-component-card.module';
import { DebtComponentGridModule } from './grid/debt-component-grid.module';

import { DebtComponentService } from './debt-component.service';

@NgModule({
  imports: [
    DebtComponentCardModule,
    DebtComponentGridModule,
    CommonModule,
  ],
  exports: [
    DebtComponentCardModule,
    DebtComponentGridModule,
  ],
  providers: [
    DebtComponentService,
  ]
})
export class DebtComponentModule { }
