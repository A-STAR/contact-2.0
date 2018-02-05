import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ParamCardComponent } from './param-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ParamCardComponent,
  ],
  exports: [
    ParamCardComponent,
  ]
})
export class ParamCardModule { }
