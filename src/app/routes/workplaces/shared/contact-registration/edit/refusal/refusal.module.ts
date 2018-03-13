import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationRefusalComponent } from './refusal.component';

@NgModule({
  declarations: [
    ContactRegistrationRefusalComponent,
  ],
  exports: [
    ContactRegistrationRefusalComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class ContactRegistrationRefusalModule {}
