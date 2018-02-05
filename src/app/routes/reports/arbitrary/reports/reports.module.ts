import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportGridModule } from './grid/report-grid.module';
import { ReportCardModule } from './card/report-card.module';

import { ReportsService } from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    ReportGridModule,
    ReportCardModule,
  ],
  exports: [
    ReportGridModule,
    ReportCardModule,
  ],
  providers: [
    ReportsService,
  ]
})
export class ReportsModule { }
