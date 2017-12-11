import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IDebt } from '../../../../../../core/debt/debt.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtService } from '../../../../../../core/debt/debt.service';
import { DebtorCardService } from '../../../../../../core/app-modules/debtor-card/debtor-card.service';
import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../../core/utils/helpers';

@Component({
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGridComponent {
  @Output() select = new EventEmitter<IDebt>();

  selectedDebt$ = new BehaviorSubject<IDebt>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedDebt$.map(debt => debt && !!debt.id) ]),
      action: () => this.onEdit(this.selectedDebt$.value.id)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS,
      enabled: combineLatestAnd([
        this.selectedDebt$.map(debt => debt && !!debt.id && ![ 6, 7, 8, 17 ].includes(debt.statusCode)),
        this.userPermissionsService.bag().map(bag => (
          bag.containsOneOf('DEBT_STATUS_EDIT_LIST', [ 9, 12, 15 ]) ||
          bag.containsCustom('DEBT_STATUS_EDIT_LIST'))
        )
      ]),
      action: () => this.onChangeStatus()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      label: 'widgets.debt.toolbar.call',
      icon: 'fa fa-phone',
      enabled: combineLatestAnd([
        this.selectedDebt$.map(debt => debt && !!debt.id && ![ 6, 7, 8, 17 ].includes(debt.statusCode)),
        this.userPermissionsService.has('DEBT_NEXT_CALL_DATE_SET'),
      ]),
      action: () => this.onNextCall()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_CLOSE,
      enabled: this.selectedDebt$.map(debt => debt && !!debt.id),
      children: [
        {
          label: 'widgets.debt.toolbar.forRepayment',
          action: () => this.onClose(10),
          enabled: combineLatestAnd([
            this.selectedDebt$.map(debt => debt && !!debt.id && debt.statusCode !== 8 && debt.statusCode !== 10),
            this.userPermissionsService.contains('DEBT_STATUS_EDIT_LIST', 10),
          ])
        },
        {
          label: 'widgets.debt.toolbar.withdrawn',
          action: () => this.onClose(8),
          enabled: combineLatestAnd([
            this.selectedDebt$.map(debt => debt && !!debt.id && debt.statusCode !== 8),
            this.userPermissionsService.contains('DEBT_STATUS_EDIT_LIST', 8),
          ])
        },
        {
          label: 'widgets.debt.toolbar.terminate',
          action: () => this.onClose(6),
          enabled: combineLatestAnd([
            this.selectedDebt$.map(debt => debt && !!debt.id && !(debt.statusCode >= 6 && debt.statusCode <= 8)),
            this.userPermissionsService.contains('DEBT_STATUS_EDIT_LIST', 6),
          ])
        },
      ]
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => {} // this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'creditTypeCode', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE },
    { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBTOR_STAGE_CODE },
    { prop: 'account'},
    { prop: 'creditStartDate', renderer: 'dateRenderer' },
    { prop: 'currencyId', lookupKey: 'currencies' },
    { prop: 'debtAmount', renderer: 'numberRenderer' },
    { prop: 'totalAmount', renderer: 'numberRenderer' },
    { prop: 'dpd' },
    { prop: 'portfolioId', lookupKey: 'portfolios' },
    { prop: 'bankId', lookupKey: 'contractors' },
    { prop: 'debtReasonCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON },
  ];

  // debts: Array<IDebt> = [];

  dialog$ = new BehaviorSubject<number>(null);
  debtCloseDialogStatus$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private gridService: GridService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    // this.fetch();
  }

  get debts$(): Observable<any> {
    return this.debtorCardService.debts$;
  }

  onDoubleClick(debt: IDebt): void {
    this.selectedDebt$.next(debt);
    this.select.emit(debt);
    this.onEdit(debt.id);
  }

  onSelect(debt: IDebt): void {
    this.selectedDebt$.next(debt);
    this.select.emit(debt);
  }

  onDialogClose(): void {
    this.dialog$.next(null);
  }

  onChangeStatusDialogSubmit(): void {
    // this.fetch();
  }

  onCloseDialogSubmit(): void {
    // this.fetch();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/debt/create` ]);
  }

  private onEdit(debtId: number): void {
    // this.router.navigate([ `/workplaces/debt-processing/${this.personId}/${debtId}/debt` ]);
  }

  private onChangeStatus(): void {
    this.dialog$.next(1);
  }

  private onClose(status: number): void {
    this.dialog$.next(2);
    this.debtCloseDialogStatus$.next(status);
  }

  private onNextCall(): void {
    this.dialog$.next(3);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.bag()
      .map(bag => (
        bag.has('DEBT_ADD') &&
        bag.notEmptyAllOf([ 'DEBT_DICT1_EDIT_LIST', 'DEBT_DICT2_EDIT_LIST', 'DEBT_DICT3_EDIT_LIST', 'DEBT_DICT4_EDIT_LIST' ])
      ))
      .distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.bag()
      .map(bag => (
        bag.hasOneOf([ 'DEBT_EDIT', 'DEBT_PORTFOLIO_EDIT', 'DEBT_COMPONENT_AMOUNT_EDIT' ]) ||
        bag.notEmptyOneOf([ 'DEBT_DICT1_EDIT_LIST', 'DEBT_DICT2_EDIT_LIST', 'DEBT_DICT3_EDIT_LIST', 'DEBT_DICT4_EDIT_LIST' ])
      ))
      .distinctUntilChanged();
  }
}
