import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AddressGridModule } from './address/address.module';
import { DialogModule } from '../../../../../shared/components/dialog/dialog.module';
import { PhoneGridModule } from './phone/phone.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { RegisterContactComponent } from './register-contact.component';

@NgModule({
  imports: [
    AddressGridModule,
    CommonModule,
    DialogModule,
    PhoneGridModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [
    RegisterContactComponent,
  ],
  declarations: [
    RegisterContactComponent,
  ]
})
export class RegisterContactModule { }
