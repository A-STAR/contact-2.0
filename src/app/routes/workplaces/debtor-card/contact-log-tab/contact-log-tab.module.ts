import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorContactLogTabComponent } from './contact-log-tab.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorContactLogTabComponent
  ],
  declarations: [
    DebtorContactLogTabComponent
  ],
})
export class ContactLogTabModule {}
