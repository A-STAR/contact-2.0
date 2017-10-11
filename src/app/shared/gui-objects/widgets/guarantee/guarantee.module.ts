import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuaranteeCardModule } from './card/guarantee-card.module';
import { GuaranteeGridModule } from './grid/guarantee-grid.module';

import { GuaranteeService } from './guarantee.service';

@NgModule({
  imports: [
    GuaranteeCardModule,
    GuaranteeGridModule,
    CommonModule,
  ],
  exports: [
    GuaranteeCardModule,
    GuaranteeGridModule,
  ],
  providers: [
    GuaranteeService,
  ]
})
export class GuaranteeModule { }
