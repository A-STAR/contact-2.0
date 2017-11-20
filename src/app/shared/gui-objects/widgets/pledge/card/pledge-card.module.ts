import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { PledgorModule } from '../../pledgor/pledgor.module';
import { PledgorPropertyModule } from '../../pledgor-property/pledgor-property.module';

import { PledgeCardComponent } from './pledge-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule,
    PledgorModule,
    PledgorPropertyModule,
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
