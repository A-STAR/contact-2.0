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
        loadChildren: './utilities/campaigns/campaigns.module#CampaignsModule',
      },
      {
        path: 'currencies',
        loadChildren: './utilities/currencies/currencies.module#CurrenciesModule',
      },
      {
        path: 'groups',
        loadChildren: './utilities/groups/groups.module#GroupsModule',
      },
      {
        path: 'contact-properties',
        loadChildren: './utilities/contact-properties/contact-properties.module#ContactPropertiesModule',
      },
      {
        path: 'data-upload',
        loadChildren: './utilities/data-upload/data-upload.module#DataUploadModule',
      },
      {
        path: 'message-templates',
        loadChildren: './utilities/message-templates/message-templates.module#MessageTemplatesModule',
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
