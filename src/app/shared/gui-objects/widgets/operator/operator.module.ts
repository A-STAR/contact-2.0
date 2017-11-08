import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorGridModule } from './grid/operator-grid.module';

import { OperatorService } from './operator.service';

@NgModule({
  imports: [
    OperatorGridModule,
    CommonModule,
  ],
  exports: [
    OperatorGridModule,
  ],
  providers: [
    OperatorService,
  ]
})
export class OperatorModule { }
