import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorContactLogTabComponent } from './contact-log-tab.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorContactLogTabComponent
  ],
  declarations: [
    DebtorContactLogTabComponent
  ],
})
export class ContactLogTabModule {}
