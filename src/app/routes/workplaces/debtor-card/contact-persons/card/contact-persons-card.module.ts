import { NgModule } from '@angular/core';

import { AddressGridModule } from '@app/routes/workplaces/shared/address/grid/address-grid.module';
import { IdentityGridModule } from '@app/routes/workplaces/debtor-card/identity/grid/identity-grid.module';
import { EmploymentGridModule } from '@app/routes/workplaces/debtor-card/employment/grid/employment-grid.module';
import { PersonSelectModule } from '@app/routes/workplaces/debtor-card/contact-persons/card/person-select/person-select.module';
import { PhoneGridModule } from '@app/routes/workplaces/shared/phone/grid/phone-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactPersonsCardComponent } from './contact-persons-card.component';

@NgModule({
  imports: [
    AddressGridModule,
    SharedModule,
    EmploymentGridModule,
    IdentityGridModule,
    PersonSelectModule,
    PhoneGridModule,
  ],
  exports: [
    ContactPersonsCardComponent,
  ],
  declarations: [
    ContactPersonsCardComponent,
  ],
})
export class ContactPersonsCardModule {}
