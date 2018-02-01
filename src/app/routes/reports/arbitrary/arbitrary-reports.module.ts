import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ReportsModule } from './reports/reports.module';
import { FieldsModule } from './fields/fields.module';

import { ArbitraryReportsComponent } from './arbitrary-reports.component';
import { ReportCardComponent } from './reports/card/report-card.component';
import { FieldCardComponent } from './fields/card/field-card.component';

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
  {
    path: 'fields/create',
    component: FieldCardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'fields/:reportId',
    component: FieldCardComponent,
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
    FieldsModule,
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
