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
  { path: 'create', component: ReportCardComponent },
  { path: ':reportId', component: ReportCardComponent },
  { path: ':reportId/fields/create', component: FieldCardComponent },
  { path: ':reportId/fields/:fieldId', component: FieldCardComponent },
  { path: ':reportId/params/create', component: ParamCardComponent },
  { path: ':reportId/params/:paramId', component: ParamCardComponent },
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
})
export class ArbitraryReportsModule {}
