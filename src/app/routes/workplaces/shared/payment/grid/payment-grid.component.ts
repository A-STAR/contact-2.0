import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IPayment } from '../payment.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PaymentService } from '../payment.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateTimeRendererComponent, NumberRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd } from '@app/core/utils';
import { CompleteStatus } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-payment-grid',
  templateUrl: './payment-grid.component.html',
})
export class PaymentGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() hideToolbar = false;
  @Input() set debtId(debtId: number) {
    this._debtId = debtId;
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }

  private selectedPayment$ = new BehaviorSubject<IPayment>(null);
  private debtId$ = new BehaviorSubject<number>(null);
  private _debtId: number;

  displayCanceled = false;

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: combineLatestAnd([ this.canAdd$, this.debtId$.map(Boolean) ]),
        action: () => this.onAdd(),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        enabled: combineLatestAnd([
          this.canEdit$,
          this.selectedPayment$.map(payment => payment && !payment.isCanceled),
        ]),
        action: () => this.onEdit()
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.OK,
        label: 'debtor.paymentsTab.confirm.buttonLabel',
        enabled: combineLatestAnd([
          this.canСonfirm$,
          this.selectedPayment$.map(payment => payment && !payment.isCanceled && !payment.isConfirmed),
        ]),
        action: () => this.setDialog('confirm')
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.UNDO,
        label: 'debtor.paymentsTab.cancel.buttonLabel',
        action: () => this.setDialog('cancel'),
        enabled: combineLatestAnd([
          this.canCancel$,
          this.selectedPayment$.map(payment => payment && !payment.isCanceled),
        ]),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: this.canRefresh$
      },
      {
        type: ToolbarItemType.CHECKBOX,
        action: () => this.toggleFilter(),
        label: 'widgets.payment.toolbar.showCanceled',
        state: of(this.displayCanceled)
      }
    ]
  };

  columns: ISimpleGridColumn<IPayment>[] = [
    { prop: 'amount', minWidth: 110, maxWidth: 130, renderer: NumberRendererComponent },
    { prop: 'paymentDateTime', minWidth: 130, maxWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'currencyName', minWidth: 90, maxWidth: 110 },
    { prop: 'amountMainCurrency', minWidth: 120, maxWidth: 150, renderer: NumberRendererComponent },
    { prop: 'receiveDateTime', minWidth: 130, maxWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'statusCode', minWidth: 120, maxWidth: 130, dictCode: UserDictionariesService.DICTIONARY_PAYMENT_STATUS },
    { prop: 'purposeCode', minWidth: 120, maxWidth: 130, dictCode: UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE },
    { prop: 'comment', minWidth: 100 },
    { prop: 'userFullName', minWidth: 150 },
    { prop: 'reqUserFullName', minWidth: 150 },
    { prop: 'payerName', minWidth: 120 },
    { prop: 'receiptNumber', minWidth: 110, maxWidth: 130 },
    { prop: 'commission', minWidth: 100, renderer: NumberRendererComponent },
    // TODO(atymchuk): the currency should appear in the promiseAmount column header
    // { prop: 'currencyId', hidden: true, lookupKey: 'currencies', },
  ].map(addGridLabel('widgets.payment.grid'));

  rows: IPayment[] = [];

  private dialog: string;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;
  private paymentChangeSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
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

    this.paymentChangeSub = this.contactRegistrationService
      .completeRegistration$
      // tslint:disable-next-line:no-bitwise
      .filter(status => Boolean(status & CompleteStatus.Payment))
      .subscribe(_ => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPayment$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    if (this.paymentChangeSub) {
      this.paymentChangeSub.unsubscribe();
    }
  }

  get debtId(): number {
    return this._debtId;
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
    this.paymentService.update(this._debtId, paymentId, payment, this.callCenter)
    .subscribe(
      () => this.setDialog().fetch(),
      () => this.setDialog()
    );
  }

  onCancelConfirm(): void {
    const { id: paymentId } = this.selectedPayment$.value;
    const payment = { isCanceled: 1 } as IPayment;
    this.paymentService.update(this._debtId, paymentId, payment, this.callCenter)
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
      ? `payment/${this._debtId}/${id}`
      : `debt/payment/${id}`;
    this.routingService.navigate([ url ], this.route);
  }

  private onAdd(): void {
    if (!this._debtId) {
      return;
    }
    this.routingService.navigate([ 'debt/payment/create' ], this.route);
  }

  private fetch(): void {
    if (!this._debtId) { return; }

    this.paymentService.fetchAll(this._debtId, this.displayCanceled, this.callCenter)
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
