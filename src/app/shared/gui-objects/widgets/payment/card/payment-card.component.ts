import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPayment } from '../payment.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PaymentService } from '../payment.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { minStrict } from '../../../../../core/validators';

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
    private contentTabService: ContentTabService,
    private lookupService: LookupService,
    private paymentService: PaymentService,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE),
      this.lookupService.lookupAsOptions('currencies'),
      this.lookupService.lookupAsOptions('users'),
      this.userPermissionsService.has('PAYMENT_ADD'),
      this.userPermissionsService.has('PAYMENT_EDIT'),
      this.userPermissionsService.has('PAYMENT_USER_EDIT'),
      this.canConfirm$,
      this.paymentId
        ? this.paymentService.fetch(this.debtId, this.paymentId, this.callCenter)
        : Observable.of(null),
    )
    .pipe(first())
    .subscribe(([ purposeOptions, currencyOptions, userOptions, canAdd, canEdit, canEditUser, canConfirm, payment ]) => {
      this.payment = payment ? payment : { receiveDateTime: new Date(), paymentDateTime: new Date() };
      const controls: IDynamicFormControl[] = [
        {
          label: 'widgets.payment.grid.amount', controlName: 'amount', disabled: !canEdit,
          type: 'number', validators: [minStrict(0)], width: 6
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
          type: 'checkbox', required: true, width: 12
        },
      ].map(item => ({ ...item, disabled: this.readOnly } as IDynamicFormControl));

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
    this.contentTabService.gotoParent(this.router, 4);
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
