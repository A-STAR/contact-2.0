import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationNextCallComponent } from './next-call.component';

@NgModule({
  declarations: [
    ContactRegistrationNextCallComponent,
  ],
  exports: [
    ContactRegistrationNextCallComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class ContactRegistrationNextCallModule {}
