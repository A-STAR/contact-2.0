import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentLogGridModule } from './grid/component-log-grid.module';

import { ComponentLogService } from './component-log.service';

@NgModule({
  imports: [
    ComponentLogGridModule,
    CommonModule,
  ],
  exports: [
    ComponentLogGridModule,
  ],
  providers: [
    ComponentLogService,
  ]
})
export class ComponentLogModule { }
