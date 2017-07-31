import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { EmailModule } from './email/email.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    EmailModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    EmailModule,
    PhoneModule,
  ]
})
export class WidgetsModule { }
