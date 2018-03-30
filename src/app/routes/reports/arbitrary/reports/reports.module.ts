import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportGridModule } from './grid/report-grid.module';

import { ReportsService } from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    ReportGridModule,
  ],
  exports: [
    ReportGridModule,
  ],
  providers: [
    ReportsService,
  ]
})
export class ReportsModule { }
