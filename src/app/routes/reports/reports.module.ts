import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        loadChildren: './arbitrary/arbitrary-reports.module#ArbitraryReportsModule',
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
    ReportsComponent,
  ],
  providers: [
  ]
})
export class ReportsModule {}
