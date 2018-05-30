import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantsModule } from './participants/participants.module';
import { SharedModule } from '@app/shared/shared.module';
import { StatisticsModule } from './statistics/statistics.module';

import { CampaignsService, CAMPAIGN_NAME_ID } from './campaigns.service';

import { CampaignsComponent } from './campaigns.component';
import { CampaignsEditComponent } from './campaigns-edit/campaigns-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ParticipantsModule,
    StatisticsModule,
  ],
  exports: [
    CampaignsComponent,
  ],
  declarations: [
    CampaignsComponent,
    CampaignsEditComponent,
  ],
  providers: [
    CampaignsService,
    {
      provide: CAMPAIGN_NAME_ID,
      useValue: 402,
    },
  ],
})
export class CampaignsModule {}
