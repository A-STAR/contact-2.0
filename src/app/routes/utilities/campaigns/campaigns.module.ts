import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ParticipantsModule } from '../../../routes/utilities/campaigns/participants/participants.module';
import { StatisticsModule } from '../../../routes/utilities/campaigns/statistics/statistics.module';

import { CampaignsService, CAMPAIGN_NAME_ID } from './campaigns.service';

import { CampaignsComponent } from './campaigns.component';
import { CampaignsEditComponent } from './campaigns-edit/campaigns-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ParticipantsModule,
    StatisticsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    CampaignsComponent,
    CampaignsEditComponent
  ],
  providers: [
    CampaignsService,
    {
      provide: CAMPAIGN_NAME_ID,
      useValue: 402
    }
  ],
})
export class CampaignsModule { }
