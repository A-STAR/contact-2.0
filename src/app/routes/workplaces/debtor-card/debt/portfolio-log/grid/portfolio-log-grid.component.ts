import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { IPortfolioLogEntry } from '../portfolio-log.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { PortfolioLogService } from '../portfolio-log.service';

import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers';

import { makeKey, addGridLabel } from '@app/core/utils';
import { first } from 'rxjs/operators/first';

const label = makeKey('widgets.debt');

@Component({
  selector: 'app-portfolio-log-grid',
  templateUrl: './portfolio-log-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioLogGridComponent {
  @Input() set debtId(debtId: number) {
    if (this._debtId !== debtId) {
      this.fetch(debtId);
    }
  }

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
  private _debtId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private portfolioLogService: PortfolioLogService,
  ) {}

  getEntries(directionCode: number): IPortfolioLogEntry[] {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  private fetch(debtId: number): void {
    if (debtId) {
      this.portfolioLogService
        .readAll(debtId)
        .pipe(first())
        .subscribe(entries => {
          this._entries = entries;
          this._debtId = debtId;
          this.cdRef.markForCheck();
        });
    }
  }

}
