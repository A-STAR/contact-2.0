import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsModule } from './contacts/contacts.module';
import { DebtModule } from './debt/debt.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DebtorModule } from './debtor/debtor.module';
import { DocumentsModule } from './documents/documents.module';
import { MiscModule } from './misc/misc.module';
import { OverviewModule } from './overview/overview.module';
import { PaymentsModule } from './payments/payments.module';
import { PhonesAndAddressesModule } from './phones-and-addresses/phones-and-addresses.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../shared/shared.module';

import { CallCenterComponent } from './call-center.component';

const routes: Routes = [
  { path: '', component: CallCenterComponent },
];

@NgModule({
  imports: [
    ContactsModule,
    DebtModule,
    DebtComponentsModule,
    DebtorModule,
    DocumentsModule,
    MiscModule,
    OverviewModule,
    PaymentsModule,
    PhonesAndAddressesModule,
    PromisesModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    CallCenterComponent,
  ]
})
export class CallCenterModule {}
