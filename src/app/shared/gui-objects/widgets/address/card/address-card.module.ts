import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { AddressCardService } from './address-card.service';

import { AddressCardComponent } from './address-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    AddressCardComponent,
  ],
  declarations: [
    AddressCardComponent,
  ],
  providers: [
    AddressCardService,
  ],
  entryComponents: [
    AddressCardComponent,
  ]
})
export class AddressCardModule { }
