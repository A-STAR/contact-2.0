import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        loadChildren: '../arbitrary-reports.module#ArbitraryReportsModule',
      },
      {
        path: 'create',
        loadChildren: '../reports/card/report-card.module#ReportCardModule'
      },
      {
        path: ':reportId',
        loadChildren: '../reports/card/report-card.module#ReportCardModule'
      },
      {
        path: ':reportId/fields/create',
        loadChildren: '../fields/card/field-card.module#FieldCardModule'
      },
      {
        path: ':reportId/fields/:fieldId',
        loadChildren: '../fields/card/field-card.module#FieldCardModule'
      },
      {
        path: ':reportId/params/create',
        loadChildren: '../params/card/param-card.module#ParamCardModule'
      },
      {
        path: ':reportId/params/:paramId',
        loadChildren: '../params/card/param-card.module#ParamCardModule'
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
    SharedModule,
  ],
})
export class ArbitraryReportsRoutesModule {}
