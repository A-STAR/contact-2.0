import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationStatusChangeComponent } from './status-change.component';

@NgModule({
  declarations: [
    ContactRegistrationStatusChangeComponent,
  ],
  exports: [
    ContactRegistrationStatusChangeComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class ContactRegistrationStatusChangeModule {}
