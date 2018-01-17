import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UtilitiesComponent } from './utilities.component';

const routes: Routes = [
  {
    path: '',
    component: UtilitiesComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'campaigns',
      },
      {
        path: 'campaigns',
        loadChildren: './campaigns/campaigns.module#CampaignsModule',
      },
      {
        path: 'currencies',
        loadChildren: './currencies/currencies.module#CurrenciesModule',
      },
      {
        path: 'groups',
        loadChildren: './groups/groups.module#GroupsModule',
      },
      {
        path: 'schedule',
        loadChildren: './schedule/schedule.module#ScheduleModule',
      },
      {
        path: 'contact-properties',
        loadChildren: './contact-properties/contact-properties.module#ContactPropertiesModule',
      },
      {
        path: 'data-upload',
        loadChildren: './data-upload/data-upload.module#DataUploadModule',
      },
      {
        path: 'message-templates',
        loadChildren: './message-templates/message-templates.module#MessageTemplatesModule',
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
    UtilitiesComponent,
  ],
})
export class UtilitiesModule {}
