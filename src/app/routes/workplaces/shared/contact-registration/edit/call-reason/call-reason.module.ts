import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationCallReasonComponent } from './call-reason.component';

@NgModule({
  declarations: [
    ContactRegistrationCallReasonComponent,
  ],
  exports: [
    ContactRegistrationCallReasonComponent,
  ],
  imports: [
    SelectModule,
    SharedModule,
  ]
})
export class ContactRegistrationCallReasonModule {}
