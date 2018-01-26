import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
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
    SelectModule,
    SharedModule,
  ]
})
export class ContactRegistrationRefusalModule {}
