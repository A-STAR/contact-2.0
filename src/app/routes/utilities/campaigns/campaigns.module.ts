import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignsModule as SimpleCampaignsModule } from './campaigns/campaigns.module';
import { SharedModule } from '@app/shared/shared.module';

import { CampaignsComponent } from '@app/routes/utilities/campaigns/campaigns.component';

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
    SimpleCampaignsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    CampaignsComponent,
  ],
})
export class CampaignsModule {}
