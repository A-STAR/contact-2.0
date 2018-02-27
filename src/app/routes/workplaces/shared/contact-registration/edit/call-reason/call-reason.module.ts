import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationCallReasonComponent } from './call-reason.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ContactRegistrationCallReasonComponent,
  ],
  exports: [
    ContactRegistrationCallReasonComponent,
  ],
})
export class ContactRegistrationCallReasonModule {}
