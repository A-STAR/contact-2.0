import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { DebtModule } from './debt/debt.module';
import { EmailModule } from './email/email.module';
import { IdentityModule } from './identity/identity.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    DebtModule,
    EmailModule,
    IdentityModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    DebtModule,
    EmailModule,
    IdentityModule,
    PhoneModule,
  ]
})
export class WidgetsModule { }
