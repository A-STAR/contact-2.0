import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { EmailModule } from './email/email.module';
import { IdentityModule } from './identity/identity.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    EmailModule,
    IdentityModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    EmailModule,
    IdentityModule,
    PhoneModule,
  ]
})
export class WidgetsModule { }
