import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressGridModule } from './address/address.module';
import { DialogModule } from '../../../../shared/components/dialog/dialog.module';
import { MiscModule } from './misc/misc.module';
import { PhoneGridModule } from './phone/phone.module';
import { SharedModule } from '../../../../shared/shared.module';

import { RegisterContactComponent } from './register-contact.component';

@NgModule({
  imports: [
    AddressGridModule,
    CommonModule,
    DialogModule,
    MiscModule,
    PhoneGridModule,
    SharedModule,
  ],
  exports: [
    RegisterContactComponent,
  ],
  declarations: [
    RegisterContactComponent,
  ]
})
export class RegisterContactModule { }
