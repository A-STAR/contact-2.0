import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IPayment } from '../payment.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PaymentService } from '../payment.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { addGridLabel, combineLatestAnd } from '@app/core/utils';
import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers/datetime/datetime.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-payment-grid',
  templateUrl: './payment-grid.component.html',
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

  columns: ISimpleGridColumn<IPayment>[] = [
    { prop: 'amount', minWidth: 110, maxWidth: 130 /* , renderer: 'numberRenderer' */ },
    { prop: 'paymentDateTime', minWidth: 130, maxWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'currencyName', minWidth: 90, maxWidth: 110 },
    { prop: 'amountMainCurrency', minWidth: 120, maxWidth: 150 /*, renderer: 'numberRenderer' */ },
    { prop: 'receiveDateTime', minWidth: 130, maxWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'statusCode', minWidth: 120, maxWidth: 130, dictCode: UserDictionariesService.DICTIONARY_PAYMENT_STATUS },
    { prop: 'purposeCode', minWidth: 120, maxWidth: 130, dictCode: UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE },
    { prop: 'comment', minWidth: 100 },
    { prop: 'userFullName', minWidth: 150 },
    { prop: 'reqUserFullName', minWidth: 150 },
    { prop: 'payerName', minWidth: 120 },
    { prop: 'receiptNumber', minWidth: 110, maxWidth: 130 },
    { prop: 'commission', minWidth: 100 /*, renderer: 'numberRenderer' */ },
    // TODO(atymchuk): the currency should appear in the promiseAmount column header
    // { prop: 'currencyId', hidden: true, lookupKey: 'currencies', },
  ].map(addGridLabel('widgets.payment.grid'));

  rows: IPayment[] = [];

  private dialog: string;
  private routeParams = (<any>this.route.params).value;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentService: PaymentService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    this.canViewSubscription = combineLatest(this.canView$, this.debtId$)
      .subscribe(([ hasPermission, debtId ]) => {
        if (!hasPermission) {
          this.notificationsService.permissionError().entity('entities.payments.gen.plural').dispatch();
          this.clear();
        } else if (debtId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.busSubscription = this.paymentService
      .getAction(PaymentService.MESSAGE_PAYMENT_SAVED)
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

  toggleFilter(): void {
    this.displayCanceled = !this.displayCanceled;
    this.fetch();
  }

  onSelect(payments: IPayment[]): void {
    this.selectedPayment$.next(payments[0]);
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
    const url = this.callCenter
      ? `payment/${this.debtId}/${id}`
      : `debt/payment/${id}`;
    this.routingService.navigate([ url ], this.route);
  }

  private onAdd(): void {
    if (!this.debtId) {
      return;
    }
    this.routingService.navigate([ 'debt/payment/create' ], this.route);
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
