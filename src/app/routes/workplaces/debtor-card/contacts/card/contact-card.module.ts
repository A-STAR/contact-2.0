import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AddressGridModule } from '@app/routes/workplaces/shared/address/grid/address-grid.module';
import { IdentityGridModule } from '../../identity/grid/identity-grid.module';
import { EmploymentGridModule } from '@app/routes/workplaces/debtor-card/employment/grid/employment-grid.module';
import { PersonSelectModule } from '@app/shared/gui-objects/widgets/person-select/person-select.module';
import { PhoneGridModule } from '@app/routes/workplaces/shared/phone/grid/phone-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactCardComponent } from './contact-card.component';

@NgModule({
  imports: [
    AddressGridModule,
    CommonModule,
    SharedModule,
    EmploymentGridModule,
    IdentityGridModule,
    PersonSelectModule,
    PhoneGridModule,
    TranslateModule,
  ],
  exports: [
    ContactCardComponent,
  ],
  declarations: [
    ContactCardComponent,
  ],
  entryComponents: [
    ContactCardComponent,
  ]
})
export class ContactCardModule {}
