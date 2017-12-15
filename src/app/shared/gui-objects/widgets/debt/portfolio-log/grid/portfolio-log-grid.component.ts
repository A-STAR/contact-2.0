import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IPortfolioLogEntry } from '../portfolio-log.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';

import { GridService } from '../../../../../components/grid/grid.service';
import { PortfolioLogService } from '../portfolio-log.service';

import { makeKey } from '../../../../../../core/utils';

const label = makeKey('widgets.debt');

@Component({
  selector: 'app-portfolio-log-grid',
  templateUrl: './portfolio-log-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioLogGridComponent implements OnInit {
  @Input() debtId: number;

  columns: Array<IGridColumn> = [
    { prop: 'portfolioName', minWidth: 150, maxWidth: 250 },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250 },
    { prop: 'toDate', minWidth: 150, maxWidth: 250 },
    { prop: 'fullName', minWidth: 150 },
  ];

  tabs = [
    { title: label('portfolioLog.incoming'), isInitialised: true },
    { title: label('portfolioLog.outgoing'), isInitialised: false },
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
  ) {}

  ngOnInit(): void {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.portfolioLogService.read(this.debtId).subscribe(entries => {
      this._entries = entries;
      this.cdRef.markForCheck();
    });
  }

  getEntries(directionCode: number): Array<IPortfolioLogEntry> {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

}
