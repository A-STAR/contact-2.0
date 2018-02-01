import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParamGridModule } from './grid/param-grid.module';

import { ParamsService } from './params.service';

@NgModule({
  imports: [
    CommonModule,
    ParamGridModule,
  ],
  exports: [
    ParamGridModule,
  ],
  providers: [
    ParamsService,
  ]
})
export class ParamsModule { }
