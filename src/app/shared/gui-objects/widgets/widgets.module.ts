import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { ContactModule } from './contact/contact.module';
import { DebtModule } from './debt/debt.module';
import { DocumentModule } from './documents/document.module';
import { EmailModule } from './email/email.module';
import { EmploymentModule } from './employment/employment.module';
import { IdentityModule } from './identity/identity.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    ContactModule,
    DebtModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
  exports: [
    AddressModule,
    ContactModule,
    DebtModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ]
})
export class WidgetsModule { }
