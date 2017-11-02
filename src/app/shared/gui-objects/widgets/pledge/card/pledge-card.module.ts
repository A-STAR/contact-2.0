import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { PledgerModule } from '../../pledger/pledger.module';
import { PledgerPropertyModule } from '../../pledger-property/pledger-property.module';

import { PledgeCardComponent } from './pledge-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule,
    PledgerModule,
    PledgerPropertyModule,
  ],
  exports: [
    PledgeCardComponent,
  ],
  declarations: [
    PledgeCardComponent,
  ],
  entryComponents: [
    PledgeCardComponent,
  ]
})
export class PledgeCardModule { }
