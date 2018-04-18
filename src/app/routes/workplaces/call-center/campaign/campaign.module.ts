import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { CampaignComponent } from './campaign.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: './campaign-layout/campaign-layout.module#CampaignLayoutModule',
      },
      {
        path: 'phone/:personId/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: true,
          entityKey: 'personId',
        },
      },
      {
        path: 'phone/:personId/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: true,
          entityKey: 'personId',
        },
      },
      {
        path: 'address/:personId/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: true,
          entityKey: 'personId',
        },
      },
      {
        path: 'address/:personId/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: true,
          entityKey: 'personId',
        },
      },
      {
        path: 'contactLog/:debtId/:contactId/contactLogType/:contactType',
        loadChildren: './contact/contact.module#ContactModule',
      },
      {
        path: 'promise/:debtId/:promiseId',
        loadChildren: './promise/promise.module#PromiseModule',
      },
      {
        path: 'payment/:debtId/:paymentId',
        loadChildren: './payment/payment.module#PaymentModule',
      },
    ]
  },
];

@NgModule({
  imports: [
    AngularSplitModule,
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    CampaignComponent,
  ]
})
export class CampaignModule {}
