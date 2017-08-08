import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDebt } from '../debt.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtService } from '../debt.service';
import { GridService } from '../../../../components/grid/grid.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGridComponent {
  private selectedDebtId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedDebt$).map(([ canEdit, email ]) => canEdit && !!email),
      action: () => this.onEdit(this.selectedDebtId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'creditTypeCode' },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode' },
    { prop: 'creditStartDate' },
    { prop: 'currencyId' },
    { prop: 'debtSum' },
    { prop: 'totalSum' },
    { prop: 'dpd' },
    { prop: 'portfolio' },
    { prop: 'bank' },
    { prop: 'debtReasonCode' },
  ];

  debts: Array<IDebt> = [];

  private personId = (this.route.params as any).value.id || null;

  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    creditTypeCode: [],
    statusCode: [],
    currencyId: [],
    debtReasonCode: [],
    creditStartDate: 'dateTimeRenderer',
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private gridService: GridService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
      ]),
      this.lookupService.currencyOptions,
    ).subscribe(([ dictionariesOptions, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        creditTypeCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_PRODUCT_TYPE] ],
        statusCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_DEBT_STATUS] ],
        debtReasonCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON] ],
        currencyId: [ ...currencyOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });

    this.fetch().subscribe(debts => this.debts = debts);
  }

  onDoubleClick(debt: IDebt): void {

  }

  onSelect(debt: IDebt): void {

  }

  onAdd(): void {

  }

  onEdit(debtId: number): void {

  }

  get selectedDebt$(): Observable<IDebt> {
    return this.selectedDebtId$.map(id => this.debts.find(debt => debt.id === id));
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'DEBT_ADD',
        // TODO(d.maltsev): DEBT_DICTX_EDIT_LIST are not necesserily boolean values
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST'
      ])
      .distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'DEBT_EDIT',
        'DEBT_PORTFOLIO_EDIT',
        'DEBT_COMPONENT_SUM_EDIT',
        // TODO(d.maltsev): DEBT_DICTX_EDIT_LIST are not necesserily boolean values
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST'
      ])
      .distinctUntilChanged();
  }

  private fetch(): Observable<Array<IDebt>> {
    return this.debtService.fetchAll(this.personId);
  }
}
