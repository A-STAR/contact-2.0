import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationComponent } from './contact-registration.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactRegistrationComponent,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
})
export class ContactRegistrationModule {}
