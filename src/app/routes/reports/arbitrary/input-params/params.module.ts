import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputParamCardModule } from './card/params-card.module';
import { InputPramsDialogModule } from './dialog/input-params-dialog.module';

import { ParamsService } from './params.service';

@NgModule({
  imports: [
    CommonModule,
    InputParamCardModule,
    InputPramsDialogModule,
  ],
  exports: [
    InputParamCardModule,
    InputPramsDialogModule,
  ],
  providers: [
    ParamsService,
  ]
})
export class InputParamsModule { }
