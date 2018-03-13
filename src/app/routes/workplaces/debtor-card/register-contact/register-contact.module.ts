import { NgModule } from '@angular/core';

import { AddressGridModule } from './address/address.module';
import { DialogModule } from '../../../../shared/components/dialog/dialog.module';
import { MiscModule } from './misc/misc.module';
import { PhoneGridModule } from './phone/phone.module';
import { SharedModule } from '../../../../shared/shared.module';

import { RegisterContactComponent } from './register-contact.component';

@NgModule({
  imports: [
    AddressGridModule,
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
