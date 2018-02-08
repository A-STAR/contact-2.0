import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { InputParamsCardComponent } from './params-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    InputParamsCardComponent,
  ],
  exports: [
    InputParamsCardComponent,
  ]
})
export class InputParamCardModule { }
