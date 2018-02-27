import { NgModule } from '@angular/core';

import { ContactSelectModule } from '../contact-select/contact-select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationPhoneComponent } from './phone.component';

@NgModule({
  declarations: [
    ContactRegistrationPhoneComponent,
  ],
  exports: [
    ContactRegistrationPhoneComponent,
  ],
  imports: [
    ContactSelectModule,
    SharedModule,
  ],
})
export class ContactRegistrationPhoneModule {}
