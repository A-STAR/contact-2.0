import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IGridDef, IWorkTaskEntry } from './work-task.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';

import { makeKey } from '../../../core/utils';
import { first } from 'rxjs/operators';

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

  get availableGrids$(): Observable<IGridDef[]> {
    return combineLatest(this.grids.map(g => g.permission))
      .map(permissions => permissions.map((p, i) => p && this.grids[i]).filter(Boolean));
  }

  onTabSelect(tabIndex: number): void {
    this.availableGrids$
      .pipe(first())
      .subscribe(grids => {
        grids[tabIndex].isInitialised = true;
        this.selectedTabIndex = tabIndex;
        this.cdRef.markForCheck();
      });
  }
}
