import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IGridDef, IWorkTaskEntry } from './work-task.interface';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.workTask');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-work-task',
  templateUrl: 'work-task.component.html',
})
export class WorkTaskComponent {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IWorkTaskEntry>;

  rows: IWorkTaskEntry[] = [];
  rowCount = 0;
  selectedTabIndex = 0;

  grids: IGridDef[] = [
    { rowIdKey: 'debtId', key: 'workTask.All', title: label('all.title'), isInitialised: true },
    { rowIdKey: 'debtId', key: 'workTask.NewDebt', title: label('newDebt.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.ProblemDebt', title: label('problemDebt.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.SearchInformation', title: label('searchInformation.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.DebtToContractor', title: label('debtToContractor.title'), isInitialised: false },
    { rowIdKey: 'id', key: 'workTask.PrepareVisits', title: label('prepareVisits.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.CustomStatus', title: label('customStatus.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.Close', title: label('closed.title'), isInitialised: false },
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex = tabIndex;
    this.cdRef.markForCheck();
  }
}
