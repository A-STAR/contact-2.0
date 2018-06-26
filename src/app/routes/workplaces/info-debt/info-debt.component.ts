import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';

import { IActionGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridDef, IInfoDebtEntry, IGridColumn } from './info-debt.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { GridComponent } from './grid/grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.infoDebt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-info-debt',
  templateUrl: 'info-debt.component.html',
})
export class InfoDebtComponent {
  private selectedRows$ = new BehaviorSubject<IInfoDebtEntry[]>(null);
  private selectedTabIndex$ = new BehaviorSubject<number>(0);

  @ViewChildren(GridComponent) gridComponents: QueryList<GridComponent>;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

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

  letterGridColumns: IGridColumn[] = [
    { dataType: 1, name: 'letterId' },
    { dataType: 3, name: 'address' },
    { dataType: 6, name: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_STATUS },
    { dataType: 2, name: 'createDateTime' },
    { dataType: 2, name: 'sendDateTime' },
    { dataType: 3, name: 'userFullName' },
    { dataType: 3, name: 'templateName' },
  ].map(col => ({ ...col, label: label(`letter.grid.${col.name}`)}));

  grids: IGridDef[] = [
    {
      rowIdKey: 'debtId',
      gridKey$: of('infoDebtDebtors'),
      title: label('debtors.title'),
      isInitialised: true,
      permission: this.userPermissionsService.has('INFO_DEBT_DEBTOR_TAB')
    },
    {
      rowIdKey: 'id',
      gridKey$: of('infoDebtGuarantors'),
      title: label('guarantors.title'),
      isInitialised: false,
      permission: this.userPermissionsService.has('INFO_DEBT_GUARANTOR_TAB')
    },
    {
      rowIdKey: 'id',
      gridKey$: of('infoDebtPledgors'),
      title: label('pledgors.title'),
      isInitialised: false,
      permission: this.userPermissionsService.has('INFO_DEBT_PLEDGOR_TAB')
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
      columns: this.smsGridColumns,
      permission: this.selectedTabIndex$.flatMap(index => this.grids[index].permission)
    },
    {
      rowIdKey: 'emailId',
      gridKey$: this.selectedRows$
        .map(rows => rows && rows[0])
        .map(row => row && `/debt/${row.debtId}/person/${row.personId}/personRole/${row.personRole}/email`),
      title: label('email.title'),
      isInitialised: false,
      columns: this.emailGridColumns,
      permission: this.selectedTabIndex$.flatMap(index => this.grids[index].permission)
    },
    {
      rowIdKey: 'letterId',
      gridKey$: this.selectedRows$
        .map(rows => rows && rows[0])
        .map(row => row && `/debt/${row.debtId}/person/${row.personId}/personRole/${row.personRole}/letter`),
      title: label('letter.title'),
      isInitialised: false,
      actions: [
        {
          action: 'letterExport'
        }
      ],
      columns: this.letterGridColumns,
      permission: this.selectedTabIndex$.flatMap(index => this.grids[index].permission)
    }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService
  ) { }

  get currentGrid(): GridComponent {
    const components = this.gridComponents && this.gridComponents.toArray();
    return components && components[this.selectedTabIndex$.value];
  }

  get selection(): IInfoDebtEntry[] {
    return this.currentGrid && this.currentGrid.selection;
  }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex$.next(tabIndex);
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

  onAction(action: IActionGridAction): void {
    this.selectedRows$
      .pipe(
        first()
      )
      .subscribe(rows => {
        const detailRow = action.selection.node;
        this.downloader.fallbackName = detailRow.data.templateName;
        this.downloader.url = `/debts/${rows[0].debtId}/letter/${detailRow.data.letterId}/file`;
        this.downloader.download();
      });
  }
}
