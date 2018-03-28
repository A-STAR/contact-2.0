import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactPersonsGridModule } from '../contact-persons/grid/contact-persons-grid.module';
import { DebtorActionLogModule } from '../action-log/action-log.module';
import { DebtorAttributesModule } from '../attributes/attributes.module';
import { DebtorPledgeAttributesModule } from '../pledge/attributes/pledge-attributes.module';
import { DebtorPropertyAttributesModule } from '../property/attributes/property-attributes.module';
import { DebtsModule } from '../debts/debts.module';
import { EmploymentGridModule } from '../employment/grid/employment-grid.module';
import { GuaranteeGridModule } from '../guarantee/grid/guarantee-grid.module';
import { IdentityGridModule } from '../identity/grid/identity-grid.module';
import { InformationModule } from '../information/information.module';
import { PledgeGridModule } from '../pledge/grid/pledge-grid.module';
import { PropertyGridModule } from '../property/grid/property-grid.module';
import { RegisterContactModule } from '../register-contact/register-contact.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '../../shared/shared.module';


import { DebtorCardLayoutComponent } from './debtor-card-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorCardLayoutComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    ContactPersonsGridModule,
    DebtorActionLogModule,
    DebtorAttributesModule,
    GuaranteeGridModule,
    DebtorPledgeAttributesModule,
    PledgeGridModule,
    DebtorPropertyAttributesModule,
    EmploymentGridModule,
    IdentityGridModule,
    PropertyGridModule,
    DebtsModule,
    InformationModule,
    RegisterContactModule,
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    DebtorCardLayoutComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class DebtorCardLayoutModule {}
