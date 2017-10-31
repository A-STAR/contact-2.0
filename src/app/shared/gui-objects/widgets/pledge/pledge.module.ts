import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgeGridModule } from './grid/pledge-grid.module';

import { PledgeService } from './pledge.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PledgeGridModule,
  ],
  providers: [
    PledgeService,
  ]
})
export class PledgeModule { }
