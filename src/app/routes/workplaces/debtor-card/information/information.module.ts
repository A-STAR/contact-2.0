import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyModule } from './company/company.module';
import { PersonModule } from './person/person.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorInformationComponent } from './information.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyModule,
    PersonModule,
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorInformationComponent
  ],
  declarations: [
    DebtorInformationComponent
  ]
})
export class InformationModule {}
