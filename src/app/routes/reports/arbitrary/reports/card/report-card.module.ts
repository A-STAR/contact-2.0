import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ReportsService } from '../reports.service';

import { ReportCardComponent } from './report-card.component';

const routes: Routes = [
  {
    path: '',
    component: ReportCardComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ReportCardComponent,
  ],
  exports: [
    ReportCardComponent,
  ],
  providers: [
    ReportsService
  ]
})
export class ReportCardModule { }
