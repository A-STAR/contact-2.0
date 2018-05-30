import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { GenesysService } from '@app/routes/utilities/campaigns/genesys/genesys.service';

import { GenesysCampaignsComponent } from './genesys.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    GenesysCampaignsComponent,
  ],
  declarations: [
    GenesysCampaignsComponent,
  ],
  providers: [
    GenesysService,
  ]
})
export class GenesysCampaignsModule {}
