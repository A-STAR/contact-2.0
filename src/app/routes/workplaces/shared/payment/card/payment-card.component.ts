import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPayment } from '../payment.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { PaymentService } from '../payment.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html'
})
export class PaymentCardComponent {
  @Input() callCenter = false;
  @Input() readOnly = false;
  @Input() debtId: number;
  @Input() paymentId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = null;
  dialog: string;
  payment: IPayment;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {

    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE),
      this.lookupService.lookupAsOptions('currencies'),
      this.lookupService.lookupAsOptions('users'),
      this.userPermissionsService.has('PAYMENT_ADD'),
      this.userPermissionsService.has('PAYMENT_EDIT'),
      this.userPermissionsService.has('PAYMENT_USER_EDIT'),
      this.canConfirm$,
      this.paymentId
        ? this.paymentService.fetch(this.debtId, this.paymentId, this.callCenter)
        : of(null),
    )
    .pipe(first())
    .subscribe(([ purposeOptions, currencyOptions, userOptions, canAdd, canEdit, canEditUser, canConfirm, payment ]) => {
      this.payment = payment ? payment : { receiveDateTime: new Date(), paymentDateTime: new Date() };
      const controls: IDynamicFormControl[] = [
        {
          label: 'widgets.payment.grid.amount', controlName: 'amount', disabled: !canEdit,
          type: 'number', positive: true, width: 6
        },
        {
          label: 'widgets.payment.grid.currencyName', controlName: 'currencyId', disabled: !canEdit,
          type: 'select', required: true, options: currencyOptions, width: 6
        },
        {
          label: 'widgets.payment.grid.paymentDateTime', controlName: 'paymentDateTime', disabled: !canEdit,
          type: 'datepicker', required: true, markAsDirty: !payment, width: 6 },
        {
          label: 'widgets.payment.grid.receiveDateTime', controlName: 'receiveDateTime', disabled: !canEdit,
          type: 'datepicker', markAsDirty: !payment, width: 6 },
        { label: 'widgets.payment.grid.payerName', controlName: 'payerName', type: 'text', disabled: !canEdit, width: 6 },
        {
          label: 'widgets.payment.grid.reqUserFullName', controlName: 'reqUserId', disabled: !canEditUser,
          type: 'select', options: userOptions, width: 6
        },
        { label: 'widgets.payment.grid.receiptNumber', controlName: 'receiptNumber', type: 'text', disabled: !canEdit, width: 6 },
        {
          label: 'widgets.payment.grid.purposeCode', controlName: 'purposeCode', disabled: !canEdit,
          type: 'select', options: purposeOptions, width: 6
        },
        { label: 'widgets.payment.grid.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit, width: 12 },
        {
          label: 'widgets.payment.grid.isConfirmed', controlName: 'isConfirmed', disabled: !canConfirm,
          type: 'checkbox', width: 12
        },
      ].map(item => ({ ...item, disabled: this.readOnly } as IDynamicFormControl));

      // TODO: fix displaying of selected payment
      this.controls =  this.payment.isCanceled
        ? controls.map(control => ({ ...control, disabled: true }))
        : !canConfirm && !this.paymentId
          ? controls.filter(control => control.controlName !== 'isConfirmed')
              .map(control => canAdd ? control : { ...control, disabled: true })
          : controls.map(control => canAdd ? control : { ...control, disabled: true });

      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get canConfirm$(): Observable<boolean> {
    return this.userPermissionsService.has('PAYMENT_CONFIRM');
  }

  onBack(): void {
    const url = this.callCenter
      ? [
        '/workplaces',
        'call-center',
        this.route.snapshot.paramMap.get('campaignId'),
      ]
      : [
        '/workplaces',
        'debtor-card',
        this.route.snapshot.paramMap.get('debtId'),
      ];

    this.routingService.navigate(url);
  }

  onSubmit(): void {
    const data: IPayment = this.form.serializedUpdates;
    const action = this.paymentId
      ? this.paymentService.update(this.debtId, this.paymentId, data, this.callCenter)
      : this.paymentService.create(this.debtId, data, this.callCenter);

    action.subscribe(() => {
      this.paymentService.dispatchAction(PaymentService.MESSAGE_PAYMENT_SAVED);
      this.onBack();
    });
  }
}
