import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { AddressCardComponent } from './address-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    AddressCardComponent,
  ],
  declarations: [
    AddressCardComponent,
  ],
  entryComponents: [
    AddressCardComponent,
  ]
})
export class AddressCardModule { }
