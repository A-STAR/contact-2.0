import { NgModule } from '@angular/core';

import { ContactRegistrationModule } from './contact-registration/contact-registration.module';

@NgModule({
  imports: [
    ContactRegistrationModule,
  ],
  exports: [
    ContactRegistrationModule,
  ],
})
export class WorkplacesSharedModule {}
