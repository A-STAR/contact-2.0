import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IPortfolioLogEntry } from '../portfolio-log.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { PortfolioLogService } from '../portfolio-log.service';

import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers';

import { makeKey, addGridLabel } from '@app/core/utils';

const label = makeKey('widgets.debt');

@Component({
  selector: 'app-portfolio-log-grid',
  templateUrl: './portfolio-log-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioLogGridComponent implements OnInit {
  @Input() debtId: number;

  columns: Array<ISimpleGridColumn<IPortfolioLogEntry>> = [
    { prop: 'portfolioName', minWidth: 150, maxWidth: 250 },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250, renderer: DateTimeRendererComponent },
    { prop: 'toDate', minWidth: 150, maxWidth: 250, renderer: DateTimeRendererComponent },
    { prop: 'fullName', minWidth: 150 },
  ].map(addGridLabel('widgets.debt.portfolioLog.grid'));

  tabs = [
    { title: label('portfolioLog.incoming'), isInitialised: true },
    { title: label('portfolioLog.outgoing'), isInitialised: false },
  ];

  private _entries: IPortfolioLogEntry[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private portfolioLogService: PortfolioLogService,
  ) {}

  ngOnInit(): void {
    this.portfolioLogService.readAll(this.debtId).subscribe(entries => {
      this._entries = entries;
      this.cdRef.markForCheck();
    });
  }

  getEntries(directionCode: number): IPortfolioLogEntry[] {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

}
