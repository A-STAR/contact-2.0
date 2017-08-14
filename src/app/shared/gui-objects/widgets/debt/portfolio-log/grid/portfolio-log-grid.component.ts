import { Component } from '@angular/core';

import { IPortfolioLogEntry } from '../portfolio-log.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';

import { PortfolioLogService } from '../portfolio-log.service';

import { toFullName } from '../../../../../../core/utils';

@Component({
  selector: 'app-portfolio-log-grid',
  templateUrl: './portfolio-log-grid.component.html'
})
export class PortfolioLogGridComponent {
  columns: Array<IGridColumn> = [
    { prop: 'portfolioName', minWidth: 150, maxWidth: 250 },
    { prop: 'fromDate', minWidth: 150, maxWidth: 250 },
    { prop: 'toDate', minWidth: 150, maxWidth: 250 },
    { prop: 'fullName', minWidth: 150, maxWidth: 250 },
  ];

  private renderers: IRenderer = {
    fullName: toFullName,
    fromDate: 'dateTimeRenderer',
    toDate: 'dateTimeRenderer'
  };

  private _entries: Array<IPortfolioLogEntry>;

  constructor(private portfolioLogService: PortfolioLogService) {
    this.portfolioLogService.read(1).subscribe(entries => this._entries = entries);
  }

  getEntries(directionCode: number): Array<IPortfolioLogEntry> {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }
}
