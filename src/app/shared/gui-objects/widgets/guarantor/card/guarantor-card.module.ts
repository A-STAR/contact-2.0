import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { GuarantorGridModule } from '../grid/guarantor-grid.module';

import { GuarantorCardComponent } from './guarantor-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    GuarantorGridModule,
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
