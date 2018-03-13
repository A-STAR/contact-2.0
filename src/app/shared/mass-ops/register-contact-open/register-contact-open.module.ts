import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { AddressGridModule } from './address/address.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { MiscModule } from './misc/misc.module';
import { PhoneGridModule } from './phone/phone.module';

import { RegisterContactOpenService } from './register-contact-open.service';

import { RegisterContactOpenComponent } from './register-contact-open.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    AddressGridModule,
    DialogModule,
    MiscModule,
    PhoneGridModule,
    TranslateModule,
  ],
  providers: [ RegisterContactOpenService ],
  declarations: [ RegisterContactOpenComponent ],
  exports: [ RegisterContactOpenComponent ]
})
export class RegisterContactOpenModule { }
