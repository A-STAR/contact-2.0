import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AddressGridModule } from '../../address/grid/address-grid.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { EmploymentGridModule } from '../../employment/grid/employment-grid.module';
import { IdentityGridModule } from '../../identity/grid/identity-grid.module';
import { PersonSelectModule } from '../../person-select/person-select.module';
import { PhoneGridModule } from '../../phone/grid/phone-grid.module';
import { TabViewModule } from '../../../../components/layout/tabview/tabview.module';

import { ContactCardComponent } from './contact-card.component';

@NgModule({
  imports: [
    AddressGridModule,
    CommonModule,
    DynamicFormModule,
    EmploymentGridModule,
    IdentityGridModule,
    PersonSelectModule,
    PhoneGridModule,
    TabViewModule,
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
