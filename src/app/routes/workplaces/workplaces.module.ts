import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        path: 'debtor-card',
        loadChildren: './debtor-card/debtor.module#DebtorCardModule',
      },
      {
        path: 'contact-registration',
        loadChildren: './contact-registration/contact-registration.module#ContactRegistrationModule',
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
        path: '**',
        redirectTo: ''
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    WorkplacesComponent,
  ],
})
export class WorkplacesModule {}
