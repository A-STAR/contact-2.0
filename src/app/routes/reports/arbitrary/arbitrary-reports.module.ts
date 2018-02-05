import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ReportsModule } from './reports/reports.module';
import { FieldsModule } from './fields/fields.module';
import { ParamsModule } from './params/params.module';

import { ArbitraryReportsComponent } from './arbitrary-reports.component';
import { ReportCardComponent } from './reports/card/report-card.component';
import { FieldCardComponent } from './fields/card/field-card.component';
import { ParamCardComponent } from './params/card/param-card.component';

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
    path: ':reportId/fields/create',
    component: FieldCardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: ':reportId/fields/:fieldId',
    component: FieldCardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: ':reportId/params/create',
    component: ParamCardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: ':reportId/params/:paramId',
    component: ParamCardComponent,
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
    ParamsModule,
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
