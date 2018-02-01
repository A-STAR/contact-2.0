import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ReportsModule } from './reports/reports.module';

import { ArbitraryReportsComponent } from './arbitrary-reports.component';
import { ReportCardComponent } from './reports/card/report-card.component';

const routes: Routes = [
  {
    path: '',
    component: ArbitraryReportsComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'create',
    component: ReportCardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: ':reportId',
    component: ReportCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ReportsModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ArbitraryReportsComponent,
  ],
  providers: [
  ]
})
export class ArbitraryReportsModule {}
