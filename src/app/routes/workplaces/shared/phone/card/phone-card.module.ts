import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { PhoneCardComponent } from './phone-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    PhoneCardComponent,
  ],
  declarations: [
    PhoneCardComponent,
  ],
  entryComponents: [
    PhoneCardComponent,
  ]
})
export class PhoneCardModule { }
