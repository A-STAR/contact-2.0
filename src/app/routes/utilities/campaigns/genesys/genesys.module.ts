import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { GenesysService } from '@app/routes/utilities/campaigns/genesys/genesys.service';

import { GenesysCampaignsComponent } from './genesys.component';
import { GenesysStatisticsComponent } from './statistics/statistics.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    GenesysCampaignsComponent,
  ],
  declarations: [
    GenesysCampaignsComponent,
    GenesysStatisticsComponent,
  ],
  providers: [
    GenesysService,
  ]
})
export class GenesysCampaignsModule {}
