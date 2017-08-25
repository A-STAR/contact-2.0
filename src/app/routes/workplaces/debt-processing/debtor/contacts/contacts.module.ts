import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorContactsComponent } from './contacts.component';
// import { DebtorAddressComponent } from '../address/address.component';
// import { DebtorEmploymentComponent } from '../employment/employment.component';
// import { DebtorIdentityComponent } from '../identity/identity.component';
// import { DebtorPhoneComponent } from '../phone/phone.component';

// const routes: Routes = [
//   { path: '', component: DebtorContactsComponent },
//   { path: 'phone/create', component: DebtorPhoneComponent },
//   { path: 'phone/:phoneId', component: DebtorPhoneComponent },
//   { path: 'address/create', component: DebtorAddressComponent },
//   { path: 'address/:addressId', component: DebtorAddressComponent },
//   { path: 'identity/create', component: DebtorIdentityComponent },
//   { path: 'identity/:identityId', component: DebtorIdentityComponent },
//   { path: 'employment/create', component: DebtorEmploymentComponent },
//   { path: 'employment/:employmentId', component: DebtorEmploymentComponent },
// ];

@NgModule({
  imports: [
    // RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    DebtorContactsComponent,
    // RouterModule,
  ],
  declarations: [
    DebtorContactsComponent
  ],
})
export class DebtorContactsModule {}
