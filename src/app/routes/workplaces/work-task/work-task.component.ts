import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IGridDef, IWorkTaskEntry } from './work-task.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

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
    {
      rowIdKey: 'debtId',
      key: 'workTask.All',
      title: label('all.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_ALL' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.NewDebt',
      title: label('newDebt.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_NEW' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.ProblemDebt',
      title: label('problemDebt.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_PROBLEM' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.SearchInformation',
      title: label('searchInformation.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_SEARCH_INFORMATION' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.DebtToContractor',
      title: label('debtToContractor.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_TOCONTRACTOR' ])
    },
    {
      rowIdKey: 'id',
      key: 'workTask.PrepareVisits',
      title: label('prepareVisits.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_PREPARE_VISITS' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.CustomStatus',
      title: label('customStatus.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_CUSTOM_STATUS' ])
    },
    {
      rowIdKey: 'debtId',
      key: 'workTask.Close',
      title: label('closed.title'),
      isInitialised: false,
      permission: this.userPermissionsService.hasOne([ 'WORK_TASK_TAB_CLOSE' ])
    },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService
  ) { }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex = tabIndex;
    this.cdRef.markForCheck();
  }
}
