import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';
import { InputParamCardModule } from '../card/params-card.module';

import { InputParamsDialogComponent } from './input-params-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InputParamCardModule,
  ],
  exports: [
    InputParamsDialogComponent
  ],
  declarations: [
    InputParamsDialogComponent
  ],
})
export class InputPramsDialogModule { }
