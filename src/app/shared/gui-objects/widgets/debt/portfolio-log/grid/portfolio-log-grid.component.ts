import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { IPortfolioLogEntry } from '../portfolio-log.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';

import { GridService } from '../../../../../components/grid/grid.service';
import { PortfolioLogService } from '../portfolio-log.service';

@Component({
  selector: 'app-portfolio-log-grid',
  templateUrl: './portfolio-log-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioLogGridComponent {
  columns: Array<IGridColumn> = [
    { prop: 'portfolioName', minWidth: 150, maxWidth: 250 },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250 },
    { prop: 'toDate', minWidth: 150, maxWidth: 250 },
    { prop: 'fullName', minWidth: 150 },
  ];

  private renderers: IRenderer = {
    fromDate: 'dateTimeRenderer',
    toDate: 'dateTimeRenderer'
  };

  private _entries: Array<IPortfolioLogEntry>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private portfolioLogService: PortfolioLogService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.portfolioLogService.read(1).subscribe(entries => {
      this._entries = entries;
      this.cdRef.markForCheck();
    });
  }

  getEntries(directionCode: number): Array<IPortfolioLogEntry> {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }
}
