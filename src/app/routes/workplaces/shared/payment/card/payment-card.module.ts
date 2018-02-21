import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { PaymentCardComponent } from './payment-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    PaymentCardComponent,
  ],
  declarations: [
    PaymentCardComponent,
  ],
  entryComponents: [
    PaymentCardComponent,
  ]
})
export class PaymentCardModule { }
