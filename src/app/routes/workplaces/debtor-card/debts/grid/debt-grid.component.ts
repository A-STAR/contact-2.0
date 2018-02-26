import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IDebt } from '@app/core/debt/debt.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateRendererComponent, NumberRendererComponent } from '@app/shared/components/grids/renderers';
import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
})
export class DebtGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedDebt$.map(debt => debt && !!debt.id) ]),
      action: () => this.onEdit()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS,
      label: 'widgets.debt.toolbar.changeStatus',
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

  columns: ISimpleGridColumn<IDebt>[] = [
    { prop: 'id' },
    { prop: 'creditTypeCode', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE },
    { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_DEBTOR_STAGE_CODE },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'account'},
    { prop: 'creditStartDate', renderer: DateRendererComponent },
    { prop: 'currencyId', lookupKey: 'currencies' },
    { prop: 'debtAmount', renderer: NumberRendererComponent },
    { prop: 'totalAmount', renderer: NumberRendererComponent },
    { prop: 'dpd' },
    { prop: 'portfolioId', lookupKey: 'portfolios' },
    { prop: 'bankId', lookupKey: 'contractors' },
    { prop: 'debtReasonCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON },
  ].map(addGridLabel('widgets.debt.grid'));

  debtCloseDialogStatus$ = new BehaviorSubject<number>(null);
  dialog: string;

  private debtUpdateSub: Subscription;

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.debtUpdateSub = this.debtorCardService
      .getAction('DEBTOR_DEBT_UPDATED')
      .subscribe(_ => this.fetch());
  }

  ngOnDestroy(): void {
    this.debtUpdateSub.unsubscribe();
  }

  get debts$(): Observable<any> {
    return this.debtorCardService.debts$;
  }

  get selectedDebt$(): Observable<IDebt> {
    return this.debtorCardService.selectedDebt$ as Observable<any>;
  }

  get selection$(): Observable<IDebt[]> {
    return this.debtorCardService.selectedDebt$.map(debt => debt ? [ debt ] : []) as Observable<any>;
  }

  onDoubleClick(debt: IDebt): void {
    this.debtorCardService.selectDebt(debt.id);
    this.onEdit();
  }

  onSelect(debts: IDebt[]): void {
    const debtId = isEmpty(debts)
      ? null
      : debts[0].id;
    this.debtorCardService.selectDebt(debtId);
  }

  onDialogClose(): void {
    this.setDialog();
  }

  onChangeStatusDialogSubmit(): void {
    this.fetch();
  }

  onCloseDialogSubmit(): void {
    this.fetch();
  }

  private onAdd(): void {
    this.routingService.navigate([ 'debt/create' ], this.route);
  }

  private onEdit(): void {
    this.selectedDebt$
      .pipe(first())
      .subscribe(debt => this.routingService.navigate([ 'debt' ], this.route));
  }

  private fetch(): void {
    this.debtorCardService.refreshDebts();
  }

  private onChangeStatus(): void {
    this.setDialog('changeStatus');
  }

  private onClose(status: number): void {
    this.setDialog('closeDebt');
    this.debtCloseDialogStatus$.next(status);
  }

  private onNextCall(): void {
    this.setDialog('nextCall');
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
