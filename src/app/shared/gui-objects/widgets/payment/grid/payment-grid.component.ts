import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPayment } from '../payment.interface';
import { IDebt } from '../../debt/debt/debt.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PaymentService } from '../payment.service';
import { GridService } from '../../../../components/grid/grid.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-payment-grid',
  templateUrl: './payment-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentGridComponent implements OnInit, OnDestroy {
  private selectedPayment$ = new BehaviorSubject<IPayment>(null);
  private debt$ = new BehaviorSubject<IDebt>(null);

  displayCanceled = false;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: Observable.combineLatest(this.canAdd$, this.debt$)
        .map(([ canAdd, debt ]) => canAdd && !!debt && !!debt.id),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedPayment$)
        .map(([ canAdd, selectedPayment ]) => canAdd && !!selectedPayment && !selectedPayment.isCanceled),
      action: () => this.onEdit()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_OK,
      label: 'debtor.paymentsTab.confirm.buttonLabel',
      enabled: Observable.combineLatest(this.canСonfirm$, this.selectedPayment$)
      .map(([ canConfirm, selectedPayment ]) =>
        canConfirm && !!selectedPayment && !selectedPayment.isCanceled && !selectedPayment.isConfirmed),
      action: () => this.setDialog('confirm')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNDO,
      label: 'debtor.paymentsTab.cancel.buttonLabel',
      action: () => this.setDialog('cancel'),
      enabled: Observable.combineLatest(this.canCancel$, this.selectedPayment$)
        .map(([canCancel, selectedPayment]) =>
          canCancel && !!selectedPayment && !selectedPayment.isCanceled),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canRefresh$
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      action: () => this.toggleFilter(),
      label: 'widgets.payment.toolbar.showCanceled',
      state: this.displayCanceled
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'amount', minWidth: 110, width: 110, maxWidth: 130 },
    { prop: 'paymentDateTime', minWidth: 120, maxWidth: 130 },
    { prop: 'currencyName', minWidth: 90, maxWidth: 110 },
    { prop: 'amountMainCurrency', minWidth: 130, maxWidth: 130 },
    { prop: 'receiveDateTime', minWidth: 120, maxWidth: 130 },
    { prop: 'statusCode' },
    { prop: 'purposeCode' },
    { prop: 'comment' },
    { prop: 'userFullName' },
    { prop: 'reqUserFullName' },
    { prop: 'payerName' },
    { prop: 'receiptNumber', minWidth: 110, maxWidth: 130 },
    { prop: 'commission', minWidth: 110, maxWidth: 130 },
  ];

  rows: Array<IPayment> = [];

  private dialog: string;
  private routeParams = (<any>this.route.params).value;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;
  private debtSubscription: Subscription;
  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    amount: 'numberRenderer',
    amountMainCurrency: 'numberRenderer',
    commission: 'numberRenderer',
    paymentDateTime: 'dateTimeRenderer',
    receiveDateTime: 'dateTimeRenderer',
    purposeCode: [],
    statusCode: [],
  };

  gridStyles = this.routeParams.contactId ? { height: '230px' } : { height: '300px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentService: PaymentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // Bind the context to the filter, or it will throw
    this.filter = this.filter.bind(this);

    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PAYMENT_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE),
      this.lookupService.lookupAsOptions('currencies'),
    )
    .subscribe(([ statusCodes, purposeCodes, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        statusCode: [ ...statusCodes ],
        purposeCode: [ ...purposeCodes ],
        currencyId: [ ...currencyOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.payments.gen.plural').dispatch();
          this.clear();
        }
      });

    this.debtSubscription = this.messageBusService
      .select(PaymentService.MESSAGE_DEBT_SELECTED)
      .subscribe((debt: IDebt) => {
        this.debt$.next(debt);
        if (!debt.id) {
          this.clear();
        } else {
          this.fetch();
        }
      });

    this.busSubscription = this.messageBusService
      .select(PaymentService.MESSAGE_PAYMENT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPayment$.complete();
    this.debt$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
  }

  get debtId(): number {
    return this.debt$.value && this.debt$.value.id;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PAYMENT_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PAYMENT_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne(['PAYMENT_EDIT', 'PAYMENT_USER_EDIT']);
  }

  get canRefresh$(): Observable<boolean> {
    return Observable.combineLatest(this.canView$, this.debt$)
      .map(([ canView, debt ]) => canView && !!debt && !!debt.id)
      .distinctUntilChanged();
  }

  get canСonfirm$(): Observable<boolean> {
    return this.userPermissionsService.has('PAYMENT_CONFIRM');
  }

  get canCancel$(): Observable<boolean> {
    return this.userPermissionsService.has('PAYMENT_CANCEL');
  }

  filter(payment: IPayment): boolean {
    return !payment.isCanceled || this.displayCanceled;
  }

  toggleFilter(): void {
    this.displayCanceled = !this.displayCanceled;
    this.fetch();
  }

  onSelect(payment: IPayment): void {
    this.selectedPayment$.next(payment);
  }

  onConfirm(): void {
    const { id: paymentId } = this.selectedPayment$.value;
    const payment = { isConfirmed: 1 } as IPayment;
    this.paymentService.update(this.debtId, paymentId, payment)
    .subscribe(
      () => this.setDialog().fetch(),
      () => this.setDialog()
    );
  }

  onCancelConfirm(): void {
    const { id: paymentId } = this.selectedPayment$.value;
    const payment = { isCanceled: 1 } as IPayment;
    this.paymentService.update(this.debtId, paymentId, payment)
      .subscribe(
        () => this.setDialog().fetch(),
        () => this.setDialog()
    );
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string = null): PaymentGridComponent {
    this.dialog = dialog;
    return this;
  }

  onCancel(): void {
    this.setDialog();
  }

  onDoubleClick(payment: IPayment): void {
    this.onEdit(payment);
  }

  private onEdit(payment: IPayment = null): void {
    const { id } = payment || this.selectedPayment$.value;
    const { debtId } = this;
    this.router.navigate([ `${this.router.url}/debt/${debtId}/payment/${id}` ]);
  }

  private onAdd(): void {
    const { debtId } = this;
    if (!debtId) { return; }
    this.router.navigate([ `${this.router.url}/debt/${debtId}/payment/create` ]);
  }

  private fetch(): void {
    const { debtId } = this;
    if (!debtId) { return; }

    this.paymentService.fetchAll(debtId, this.displayCanceled)
      .subscribe(payments => {
        this.rows = [].concat(payments);
        this.selectedPayment$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.rows = [];
    this.selectedPayment$.next(null);
    this.cdRef.markForCheck();
  }

}
