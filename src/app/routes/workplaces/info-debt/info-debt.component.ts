import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

import { IGridDef, IInfoDebtEntry, IGridColumn } from './info-debt.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from './grid/grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.infoDebt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-info-debt',
  templateUrl: 'info-debt.component.html',
})
export class InfoDebtComponent {
  private selectedRows$ = new BehaviorSubject<IInfoDebtEntry[]>(null);

  @ViewChildren(GridComponent) gridComponents: QueryList<GridComponent>;

  selectedTabIndex = 0;

  smsGridColumns: IGridColumn[] = [
    { dataType: 1, name: 'smsId' },
    { dataType: 3, name: 'phone' },
    { dataType: 6, name: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_SMS_STATUS },
    { dataType: 2, name: 'startDateTime' },
    { dataType: 2, name: 'sendDateTime' },
    { dataType: 3, name: 'userFullName' },
    { dataType: 3, name: 'text' },
    { dataType: 3, name: 'templateName' },
  ].map(col => ({ ...col, label: label(`sms.grid.${col.name}`)}));

  emailGridColumns: IGridColumn[] = [
    { dataType: 1, name: 'emailId' },
    { dataType: 3, name: 'email' },
    { dataType: 6, name: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_STATUS },
    { dataType: 2, name: 'startDateTime' },
    { dataType: 2, name: 'sendDateTime' },
    { dataType: 3, name: 'userFullName' },
    { dataType: 3, name: 'subject' },
    { dataType: 3, name: 'templateName' },
  ].map(col => ({ ...col, label: label(`email.grid.${col.name}`)}));

  grids: IGridDef[] = [
    {
      rowIdKey: 'debtId',
      gridKey$: of('infoDebtDebtors'),
      title: label('debtors.title'),
      isInitialised: true
    },
    {
      rowIdKey: 'id',
      gridKey$: of('infoDebtGuarantors'),
      title: label('guarantors.title'),
      isInitialised: false
    },
    {
      rowIdKey: 'id',
      gridKey$: of('infoDebtPledgors'),
      title: label('pledgors.title'),
      isInitialised: false
    },
  ];

  detailGrids: IGridDef[] = [
    {
      rowIdKey: 'smsId',
      gridKey$: this.selectedRows$
        .map(rows => rows && rows[0])
        .map(row => row && `/debt/${row.debtId}/person/${row.personId}/personRole/${row.personRole}/sms`),
      title: label('sms.title'),
      isInitialised: true,
      columns: this.smsGridColumns
    },
    {
      rowIdKey: 'emailId',
      gridKey$: this.selectedRows$
        .map(rows => rows && rows[0])
        .map(row => row && `/debt/${row.debtId}/person/${row.personId}/personRole/${row.personRole}/email`),
      title: label('email.title'),
      isInitialised: false,
      columns: this.emailGridColumns
    }
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  get currentGrid(): GridComponent {
    const components = this.gridComponents && this.gridComponents.toArray();
    return components && components[this.selectedTabIndex];
  }

  get selection(): IInfoDebtEntry[] {
    return this.currentGrid && this.currentGrid.selection;
  }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex = tabIndex;
    this.selectedRows$.next(this.selection);
    this.cdRef.markForCheck();
  }

  onDetailTabSelect(gridIndex: number): void {
    this.detailGrids[gridIndex].isInitialised = true;
    this.cdRef.markForCheck();
  }

  onSelect(): void {
    this.selectedRows$.next(this.selection);
    this.cdRef.markForCheck();
  }
}
