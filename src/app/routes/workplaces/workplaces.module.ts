import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkplacesCoreModule } from './core/core.module';

import { WorkplacesService } from './workplaces.service';

import { WorkplacesComponent } from './workplaces.component';

const routes: Routes = [
  {
    path: '',
    component: WorkplacesComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'debt-processing',
      },
      {
        path: 'debt-processing',
        loadChildren: './debt-processing/debt-processing.module#DebtProcessingModule',
      },
      {
        path: 'debtor/:debtorId/debt/:debtId',
        loadChildren: './debtor-card/debtor.module#DebtorCardModule',
      },
      {
        path: 'incoming-call',
        loadChildren: './incoming-call/incoming-call.module#IncomingCallModule',
      },
      {
        path: 'call-center',
        loadChildren: './call-center/call-center.module#CallCenterModule',
      },
      {
        path: 'call-center/:campaignId',
        loadChildren: './call-center/campaign/campaign.module#CampaignModule',
      },
      {
        path: 'contact-log',
        loadChildren: './contact-log/contact-log.module#ContactLogModule',
      },
      {
        path: 'payments',
        loadChildren: './payments/payments.module#PaymentsModule',
      },
      {
        path: 'tasks',
        loadChildren: './work-task/work-task.module#WorkTaskModule',
      },
      {
        path: 'outgoing-information',
        loadChildren: './info-debt/info-debt.module#InfoDebtModule',
      },
      {
        path: '**',
        redirectTo: ''
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    WorkplacesCoreModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    WorkplacesComponent,
  ],
  providers: [
    WorkplacesService,
  ]
})
export class WorkplacesModule {}
