import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyModule } from './company/company.module';
import { PersonModule } from './person/person.module';
import { PhoneGridModule } from './phone-grid/phone-grid.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorInformationComponent } from './information.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyModule,
    PersonModule,
    PhoneGridModule,
    SharedModule,
  ],
  exports: [
    DebtorInformationComponent
  ],
  declarations: [
    DebtorInformationComponent
  ]
})
export class InformationModule { }
