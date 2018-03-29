import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ReportsModule } from './reports/reports.module';
import { FieldsModule } from './fields/fields.module';
import { ParamsModule } from './params/params.module';

import { ArbitraryReportsComponent } from './arbitrary-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ArbitraryReportsComponent,
  }
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

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: './arbitrary-reports.module#ArbitraryReportsModule',
          },
          {
            path: 'create',
            loadChildren: './reports/card/report-card.module#ReportCardModule'
          },
          {
            path: ':reportId',
            loadChildren: './reports/card/report-card.module#ReportCardModule'
          },
          {
            path: ':reportId/fields/create',
            loadChildren: './fields/card/field-card.module#FieldCardModule'
          },
          {
            path: ':reportId/fields/:fieldId',
            loadChildren: './fields/card/field-card.module#FieldCardModule'
          },
          {
            path: ':reportId/params/create',
            loadChildren: './params/card/param-card.module#ParamCardModule'
          },
          {
            path: ':reportId/params/:paramId',
            loadChildren: './params/card/param-card.module#ParamCardModule'
          },
          {
            path: '**',
            redirectTo: ''
          },
        ]
      },
    ]),
  ],
})
export class RoutesModule {}
