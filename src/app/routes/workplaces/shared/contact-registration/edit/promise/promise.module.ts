import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationPromiseComponent } from './promise.component';

@NgModule({
  declarations: [
    ContactRegistrationPromiseComponent,
  ],
  exports: [
    ContactRegistrationPromiseComponent,
  ],
  imports: [
    SelectModule,
    SharedModule,
  ],
})
export class ContactRegistrationPromiseModule {}
