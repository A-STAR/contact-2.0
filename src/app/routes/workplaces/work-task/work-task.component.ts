import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IGridDef, IWorkTaskEntry } from './work-task.interface';

import { ActionGridComponent } from 'app/shared/components/action-grid/action-grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.workTask');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-work-task',
  templateUrl: 'work-task.component.html',
})
export class WorkTaskComponent {
  static COMPONENT_NAME = 'WorkTaskComponent';

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IWorkTaskEntry>;

  rows: IWorkTaskEntry[] = [];
  rowCount = 0;
  selectedTabIndex = 0;

  grids: IGridDef[] = [
    { rowIdKey: 'id', key: 'workTask.NewDebt', title: label('newDebt.title'), isInitialized: true },
    { key: 'workTask.ProblemDebt', title: label('problemDebt.title'), isInitialized: false },
    { key: 'workTask.SearchInformation', title: label('searchInformation.title'), isInitialized: false },
    { key: 'workTask.DebtToContractor', title: label('debtToContractor.title'), isInitialized: false },
    { rowIdKey: 'id', key: 'workTask.PrepareVisits', title: label('prepareVisits.title'), isInitialized: false }
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialized = true;
    this.selectedTabIndex = tabIndex;
    this.cdRef.markForCheck();
  }
}
