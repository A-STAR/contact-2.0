import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { IGridDef, IWorkTaskEntry } from './work-task.interface';

import { ActionGridComponent } from 'app/shared/components/action-grid/action-grid.component';

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
    { key: 'workTask.NewDebt', title: 'modules.workTask.newDebt.title' },
    { key: 'workTask.ProblemDebt', title: 'modules.workTask.problemDebt.title' },
    { key: 'workTask.SearchInformation', title: 'modules.workTask.searchInformation.title' },
    { key: 'workTask.DebtToContractor', title: 'modules.workTask.debtToContractor.title' },
    { key: 'workTask.PrepareVisits', title: 'modules.workTask.prepareVisits.title' }
  ];

  onTabSelect(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
  }
}
