import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { GuarantorCardComponent } from './guarantor-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    GuarantorCardComponent,
  ],
  declarations: [
    GuarantorCardComponent,
  ],
  entryComponents: [
    GuarantorCardComponent,
  ]
})
export class GuarantorCardModule { }
