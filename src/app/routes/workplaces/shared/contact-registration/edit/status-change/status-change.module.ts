import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
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
    SelectModule,
    SharedModule,
  ]
})
export class ContactRegistrationStatusChangeModule {}
