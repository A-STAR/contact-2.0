import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { ContactModule } from './contact/contact.module';
import { DebtModule } from './debt/debt.module';
import { EmailModule } from './email/email.module';
import { EmploymentModule } from './employment/employment.module';
import { IdentityModule } from './identity/identity.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    ContactModule,
    DebtModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    ContactModule,
    DebtModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    PhoneModule,
  ]
})
export class WidgetsModule { }
