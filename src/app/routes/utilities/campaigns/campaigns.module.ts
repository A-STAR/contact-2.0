import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignsComponent } from './campaigns.component';
import { CampaignsEditComponent } from './campaigns-edit/campaigns-edit.component';
import { CampaignParticipantsEditComponent } from './campaign-participants-edit/campaign-participants-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CampaignsService } from './campaigns.service';

const routes: Routes = [
  { path: '', component: CampaignsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    CampaignsComponent,
    CampaignsEditComponent,
    CampaignParticipantsEditComponent
  ],
  providers: [
    CampaignsService
  ],
})
export class CampaignsModule { }
