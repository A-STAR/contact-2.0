import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { GuaranteeCardComponent } from './guarantee-card.component';
import { GuarantorModule } from '../../guarantor/guarantor.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    GuarantorModule,
    TranslateModule,
  ],
  exports: [
    GuaranteeCardComponent,
  ],
  declarations: [
    GuaranteeCardComponent,
  ],
  entryComponents: [
    GuaranteeCardComponent,
  ]
})
export class GuaranteeCardModule { }
