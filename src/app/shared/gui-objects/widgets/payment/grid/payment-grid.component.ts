import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPayment } from '../payment.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PaymentService } from '../payment.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-payment-grid',
  templateUrl: './payment-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() hideToolbar = false;
  @Input('debtId') set debtId(debtId: number) {
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }

  private selectedPayment$ = new BehaviorSubject<IPayment>(null);
  private debtId$ = new BehaviorSubject<number>(null);

  displayCanceled = false;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([ this.canAdd$, this.debtId$.map(Boolean) ]),
      action: () => this.onAdd(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedPayment$.map(payment => payment && !payment.isCanceled),
      ]),
      action: () => this.onEdit()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_OK,
      label: 'debtor.paymentsTab.confirm.buttonLabel',
      enabled: combineLatestAnd([
        this.canСonfirm$,
        this.selectedPayment$.map(payment => payment && !payment.isCanceled && !payment.isConfirmed),
      ]),
      action: () => this.setDialog('confirm')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNDO,
      label: 'debtor.paymentsTab.cancel.buttonLabel',
      action: () => this.setDialog('cancel'),
      enabled: combineLatestAnd([
        this.canCancel$,
        this.selectedPayment$.map(payment => payment && !payment.isCanceled),
      ]),
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
    { prop: 'amount', minWidth: 110, width: 110, maxWidth: 130, renderer: 'numberRenderer' },
    { prop: 'paymentDateTime', minWidth: 120, maxWidth: 130, renderer: 'dateTimeRenderer' },
    { prop: 'currencyName', minWidth: 90, maxWidth: 110 },
    { prop: 'amountMainCurrency', minWidth: 130, maxWidth: 130, renderer: 'numberRenderer' },
    { prop: 'receiveDateTime', minWidth: 120, maxWidth: 130, renderer: 'dateTimeRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PAYMENT_STATUS },
    { prop: 'purposeCode', dictCode: UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE },
    { prop: 'comment' },
    { prop: 'userFullName' },
    { prop: 'reqUserFullName' },
    { prop: 'payerName' },
    { prop: 'receiptNumber', minWidth: 110, maxWidth: 130 },
    { prop: 'commission', minWidth: 110, maxWidth: 130, renderer: 'numberRenderer' },
    // TODO(atymchuk): the currency should appear in the promiseAmount column header
    // { prop: 'currencyId', hidden: true, lookupKey: 'currencies', },
  ];

  rows: Array<IPayment> = [];

  private dialog: string;
  private routeParams = (<any>this.route.params).value;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  gridStyles = this.routeParams.contactId ? { height: '230px' } : { height: '300px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentService: PaymentService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    // Bind the context to the filter, or it will throw
    this.filter = this.filter.bind(this);

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });
  }

  ngOnInit(): void {
    this.canViewSubscription = Observable.combineLatest(this.canView$, this.debtId$)
      .subscribe(([ hasPermission, debtId ]) => {
        if (!hasPermission) {
          this.notificationsService.error('errors.default.read.403').entity('entities.payments.gen.plural').dispatch();
          this.clear();
        } else if (debtId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.busSubscription = this.messageBusService
      .select(PaymentService.MESSAGE_PAYMENT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPayment$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get debtId(): number {
    return this.debtId$.value;
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
    return combineLatestAnd([ this.canView$, this.debtId$.map(Boolean) ]).distinctUntilChanged();
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
    this.paymentService.update(this.debtId, paymentId, payment, this.callCenter)
    .subscribe(
      () => this.setDialog().fetch(),
      () => this.setDialog()
    );
  }

  onCancelConfirm(): void {
    const { id: paymentId } = this.selectedPayment$.value;
    const payment = { isCanceled: 1 } as IPayment;
    this.paymentService.update(this.debtId, paymentId, payment, this.callCenter)
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
    this.router.navigate([ this.callCenter ? `payment/${id}` : `debt/payment/${id}` ], {
      queryParams: { callCenter: Number(this.callCenter) },
      relativeTo: this.route,
    });
  }

  private onAdd(): void {
    if (!this.debtId) {
      return;
    }
    this.router.navigate([ this.callCenter ? 'payment/create' : 'debt/payment/create' ], {
      queryParams: { callCenter: Number(this.callCenter) },
      relativeTo: this.route,
    });
  }

  private fetch(): void {
    const { debtId } = this;
    if (!debtId) { return; }

    this.paymentService.fetchAll(debtId, this.displayCanceled, this.callCenter)
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
