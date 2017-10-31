import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgeGridModule } from './grid/pledge-grid.module';
import { PledgeCardModule } from './card/pledge-card.module';

import { PledgeService } from './pledge.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PledgeGridModule,
    PledgeCardModule,
  ],
  providers: [
    PledgeService,
  ]
})
export class PledgeModule { }
