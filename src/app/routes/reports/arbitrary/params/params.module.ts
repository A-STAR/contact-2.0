import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParamGridModule } from './grid/param-grid.module';
import { ParamCardModule } from './card/param-card.module';

import { ParamsService } from './params.service';

@NgModule({
  imports: [
    CommonModule,
    ParamGridModule,
    ParamCardModule,
  ],
  exports: [
    ParamGridModule,
    ParamCardModule,
  ],
  providers: [
    ParamsService,
  ]
})
export class ParamsModule { }
