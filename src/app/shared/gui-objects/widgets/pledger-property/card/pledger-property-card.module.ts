import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { PledgerPropertyGridModule } from '../grid/pledger-property-grid.module';

import { PledgerPropertyCardComponent } from './pledger-property-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
    PledgerPropertyGridModule,
  ],
  exports: [
    PledgerPropertyCardComponent,
  ],
  declarations: [
    PledgerPropertyCardComponent,
  ],
  entryComponents: [
    PledgerPropertyCardComponent,
  ]
})
export class PledgerPropertyCardModule { }
