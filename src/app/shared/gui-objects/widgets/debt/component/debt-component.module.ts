import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtComponentGridModule } from './grid/debt-component-grid.module';

import { DebtComponentService } from './debt-component.service';

@NgModule({
  imports: [
    DebtComponentGridModule,
    CommonModule,
  ],
  exports: [
    DebtComponentGridModule,
  ],
  providers: [
    DebtComponentService,
  ]
})
export class DebtComponentModule { }
