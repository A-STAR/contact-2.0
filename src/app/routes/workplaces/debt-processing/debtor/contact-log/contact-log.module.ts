import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorContactLogComponent } from './contact-log.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorContactLogComponent
  ],
  declarations: [
    DebtorContactLogComponent
  ],
})
export class ContactLogModule {}
