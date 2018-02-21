import { NgModule } from '@angular/core';

import { ContactCardModule } from '@app/routes/workplaces/debtor-card/contacts/card/contact-card.module';
import { ContactGridModule } from '@app/routes/workplaces/debtor-card/contacts/grid/contact-grid.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ContactService } from '@app/routes/workplaces/debtor-card/contacts/contact.service';

import { DebtorContactsComponent } from './contacts.component';

@NgModule({
  imports: [
    ContactCardModule,
    ContactGridModule,
    SharedModule,
  ],
  providers: [ ContactService ],
  exports: [
    ContactGridModule,
    DebtorContactsComponent,
  ],
  declarations: [
    DebtorContactsComponent
  ],
})
export class DebtorContactsModule {}
