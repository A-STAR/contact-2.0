import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorContactsComponent } from './contacts.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorContactsComponent,
  ],
  declarations: [
    DebtorContactsComponent
  ],
})
export class DebtorContactsModule {}
