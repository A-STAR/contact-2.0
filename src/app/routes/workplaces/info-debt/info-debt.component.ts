import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

import { IGridDef, IInfoDebtEntry, IGridColumn } from './info-debt.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.infoDebt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info-debt',
  templateUrl: 'info-debt.component.html',
})
export class InfoDebtComponent {
  private selectedRow$ = new BehaviorSubject<IInfoDebtEntry>(null);

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IInfoDebtEntry>;

  rows: IInfoDebtEntry[] = [];
  rowCount = 0;
  selectedTabIndex = 0;
  selectedDetailGridIndex = 0;

  smsGridColumns: IGridColumn[] = [
    { dataType: 1, name: 'smsId' },
    { dataType: 3, name: 'phone' },
    { dataType: 6, name: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_SMS_STATUS },
    { dataType: 2, name: 'startDateTime' },
    { dataType: 2, name: 'sendDateTime' },
    { dataType: 3, name: 'userFullName' },
    { dataType: 3, name: 'text' },
    { dataType: 3, name: 'templateName' },
  ];

  emailGridColumns: IGridColumn[] = [
    { dataType: 1, name: 'emailId' },
    { dataType: 3, name: 'email' },
    { dataType: 6, name: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_STATUS },
    { dataType: 2, name: 'startDateTime' },
    { dataType: 2, name: 'sendDateTime' },
    { dataType: 3, name: 'userFullName' },
    { dataType: 3, name: 'subject' },
    { dataType: 3, name: 'templateName' },
  ];

  grids: IGridDef[] = [
    {
      rowIdKey: 'debtId',
      gridKey$: of('/list?name=workTask.NewDebt'),
      title: label('debtors.title'),
      isInitialised: true
    },
    {
      rowIdKey: 'debtId',
      gridKey$: of('/list?name=workTask.ProblemDebt'),
      title: label('guarantors.title'),
      isInitialised: false
    },
    {
      rowIdKey: 'debtId',
      gridKey$: of('/list?name=workTask.DebtToContractor'),
      title: label('pledgors.title'),
      isInitialised: false
    },
  ];

  detailGrids: IGridDef[] = [
    {
      rowIdKey: 'id',
      gridKey$: this.selectedRow$.map(row => `debt/${row.debtId}/person/${row.personId}/personRoles/${row.personRole}/sms`),
      title: label('sms.title'),
      isInitialised: true,
      columns: this.smsGridColumns
    },
    {
      rowIdKey: 'id',
      gridKey$: this.selectedRow$.map(row => `debt/${row.debtId}/person/${row.personId}/personRoles/${row.personRole}/email`),
      title: label('email.title'),
      isInitialised: false,
      columns: this.emailGridColumns
    }
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex = tabIndex;
    this.cdRef.markForCheck();
  }

  onDetailTabSelect(gridIndex: number): void {
    this.detailGrids[gridIndex].isInitialised = true;
    this.selectedDetailGridIndex = gridIndex;
    this.cdRef.markForCheck();
  }
}
