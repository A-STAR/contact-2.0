import { Component } from '@angular/core';

import { IComponentLogEntry } from '../component-log.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';

import { ComponentLogService } from '../component-log.service';

import { toFullName } from '../../../../../../core/utils';

@Component({
  selector: 'app-component-log-grid',
  templateUrl: './component-log-grid.component.html'
})
export class ComponentLogGridComponent {
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

  private _entries: Array<IComponentLogEntry>;

  constructor(private componentLogService: ComponentLogService) {
    this.componentLogService.read(1).subscribe(entries => this._entries = entries);
  }

  getEntries(directionCode: number): Array<IComponentLogEntry> {
    return (this._entries || []).filter(entry => entry.directionCode === directionCode);
  }
}
