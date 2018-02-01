import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

import { IReport } from './reports/reports.interface';

@Component({
  selector: 'app-arbitrary-reports',
  templateUrl: './arbitrary-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArbitraryReportsComponent {

  reportId: number;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  onReportSelect(report: IReport): void {
    this.reportId = report && report.id;
    this.cdRef.markForCheck();
  }
}
