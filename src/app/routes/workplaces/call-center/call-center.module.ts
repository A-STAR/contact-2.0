import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { CallCenterComponent } from './call-center.component';
import { CampaignComponent } from './campaign/campaign.component';

const routes: Routes = [
  {
    path: '',
    component: CallCenterComponent,
  },
  {
    path: ':campaignId',
    loadChildren: './campaign/campaign.module#CampaignModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    CallCenterComponent,
  ]
})
export class CallCenterModule {}
