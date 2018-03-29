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
