import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild } from '@angular/core';

import { IReport } from './reports/reports.interface';

import { ReportGridComponent } from './reports/grid/report-grid.component';
import { ParamGridComponent } from './params/grid/param-grid.component';

@Component({
  selector: 'app-arbitrary-reports',
  templateUrl: './arbitrary-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArbitraryReportsComponent {

  @ViewChild(ReportGridComponent) reportGrid: ReportGridComponent;

  @ViewChild(ParamGridComponent) set paramGrid (grid: ParamGridComponent) {
    grid.rows$
      .filter(() => !!this.reportGrid)
      .subscribe(rows => this.reportGrid.canCreate = rows && !!rows.length);
  }

  reportId: number;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  onReportSelect(report: IReport): void {
    this.reportId = report && report.id;
    this.cdRef.markForCheck();
  }
}
