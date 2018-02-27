import { NgModule } from '@angular/core';

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
    SharedModule,
  ],
})
export class ContactRegistrationPromiseModule {}
