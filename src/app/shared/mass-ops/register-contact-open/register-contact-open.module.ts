import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterContactOpenComponent } from './register-contact-open.component';
import { AddressGridModule } from './address/address.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { MiscModule } from './misc/misc.module';
import { PhoneGridModule } from './phone/phone.module';

@NgModule({
  imports: [
    CommonModule,
    AddressGridModule,
    DialogModule,
    MiscModule,
    PhoneGridModule,
  ],
  declarations: [ RegisterContactOpenComponent ],
  exports: [ RegisterContactOpenComponent ]
})
export class RegisterContactOpenModule { }
