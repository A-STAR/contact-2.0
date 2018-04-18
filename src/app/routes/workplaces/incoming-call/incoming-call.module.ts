import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  {
    path: '',
    component: IncomingCallComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: './incoming-call-layout/incoming-call-layout.module#IncomingCallLayoutModule',
      },
      {
        path: ':personId/phones/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
      {
        path: ':personId/phones/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    IncomingCallComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class IncomingCallModule {}
