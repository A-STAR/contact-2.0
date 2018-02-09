import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ParamGridComponent } from './param-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ParamGridComponent,
  ],
  declarations: [
    ParamGridComponent,
  ]
})
export class ParamGridModule { }
