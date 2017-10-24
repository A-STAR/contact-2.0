import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDebt } from '../debt.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtService } from '../debt.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../../core/utils/helpers';

@Component({
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGridComponent {
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
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'creditTypeCode', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'creditStartDate', renderer: 'dateRenderer' },
    { prop: 'currencyId', lookupKey: 'currencies' },
    { prop: 'debtAmount', renderer: 'numberRenderer' },
    { prop: 'totalAmount', renderer: 'numberRenderer' },
    { prop: 'dpd' },
    { prop: 'portfolioId', lookupKey: 'portfolios' },
    { prop: 'bankId', lookupKey: 'contractors' },
    { prop: 'debtReasonCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON },
  ];

  debts: Array<IDebt> = [];

  private personId = (this.route.params as any).value.personId || null;

  dialog$ = new BehaviorSubject<number>(null);
  debtCloseDialogStatus$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {

    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.fetch();
  }

  onDoubleClick(debt: IDebt): void {
    this.onEdit(debt.id);
  }

  onSelect(debt: IDebt): void {
    this.selectedDebt$.next(debt);
    this.messageBusService.dispatch(DebtService.MESSAGE_DEBT_SELECTED, null, debt);
  }

  onDialogClose(): void {
    this.dialog$.next(null);
  }

  onChangeStatusDialogSubmit(): void {
    this.fetch();
  }

  onCloseDialogSubmit(): void {
    this.fetch();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/debt/create` ]);
  }

  private onEdit(debtId: number): void {
    this.router.navigate([ `${this.router.url}/debt/${debtId}` ]);
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

  private fetch(): void {
    this.debtService.fetchAll(this.personId).subscribe(debts => {
      this.onSelect({ id: null } as IDebt);
      this.debts = debts;
      this.cdRef.markForCheck();
    });
  }
}
