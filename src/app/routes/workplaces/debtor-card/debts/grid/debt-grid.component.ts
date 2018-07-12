import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, distinctUntilChanged, first } from 'rxjs/operators';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar/toolbar.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateRendererComponent, NumberRendererComponent } from '@app/shared/components/grids/renderers';
import { DialogFunctions } from '@app/core/dialog';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';
import { addGridLabel, combineLatestAnd } from '@app/core/utils';
import { Debt } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
})
export class DebtGridComponent extends DialogFunctions implements OnDestroy, OnInit {

  debts: Debt[];

  readonly selectedDebt$ = this.debtorService.debt$;

  readonly debtId$ = this.debtorService.debtId$;

  selection: Debt[] = [];

  readonly canAdd$ = this.userPermissionsService.bag()
    .pipe(
      map(bag => (
        bag.has('DEBT_ADD') &&
        bag.notEmptyAllOf([ 'DEBT_DICT1_EDIT_LIST', 'DEBT_DICT2_EDIT_LIST', 'DEBT_DICT3_EDIT_LIST', 'DEBT_DICT4_EDIT_LIST' ])
      )),
      distinctUntilChanged()
    );

  readonly canEdit$ = this.userPermissionsService.bag()
    .pipe(
      map(bag => (
        bag.hasOneOf([ 'DEBT_EDIT', 'DEBT_PORTFOLIO_EDIT', 'DEBT_COMPONENT_AMOUNT_EDIT' ]) ||
        bag.notEmptyOneOf([ 'DEBT_DICT1_EDIT_LIST', 'DEBT_DICT2_EDIT_LIST', 'DEBT_DICT3_EDIT_LIST', 'DEBT_DICT4_EDIT_LIST' ])
      )),
      distinctUntilChanged()
    );

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedDebt$.map(debt => debt && !!debt.id) ]),
      action: () => this.onEdit()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.CHANGE_STATUS,
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
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.CALL,
      label: 'widgets.debt.toolbar.call',
      enabled: combineLatestAnd([
        this.selectedDebt$.map(debt => debt && !!debt.id && ![ 6, 7, 8, 17 ].includes(debt.statusCode)),
        this.userPermissionsService.has('DEBT_NEXT_CALL_DATE_SET'),
      ]),
      action: () => this.onNextCall()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.CLEAR,
      label: 'widgets.debt.toolbar.terminate',
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
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch()
    },
  ];

  columns: ISimpleGridColumn<Debt>[] = [
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

  private debtsSub = new SubscriptionBag();

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    const selectionSub = this.debtorService.debt$
      .pipe(first())
      .subscribe(debt => {
        this.selection = [ debt ];
        this.cdRef.markForCheck();
      });
    const debtsSub = this.debtorService.debts$
      .subscribe(debts => {
        this.debts = debts;
        this.cdRef.markForCheck();
      });

    this.debtsSub.add(selectionSub);
    this.debtsSub.add(debtsSub);
  }

  ngOnDestroy(): void {
    this.debtsSub.unsubscribe();
  }

  onDoubleClick(debt: Debt): void {
    if (debt) {
      this.debtId$.next(debt.id);
      this.onEdit();
    }
  }

  onSelect(debts: Debt[]): void {
    if (debts && debts.length) {
      this.debtId$.next(debts[0].id);
      this.routingService.navigate([
        `/app/workplaces/debtor/${this.debtorService.debtorId$.value}/debt/${debts[0].id}` ], this.route);
    }
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
    this.routingService.navigate([
      `/app/workplaces/debtor/${this.debtorService.debtorId$.value}/debt/${this.debtId$.value}/edit/debt`
    ], this.route);
  }

  private fetch(): void {
    this.debtorService.refreshDebts();
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
}
