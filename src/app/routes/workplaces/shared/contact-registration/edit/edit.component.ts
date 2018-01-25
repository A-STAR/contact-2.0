import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';
import * as moment from 'moment';

import { IContactRegistrationMode } from '../contact-registration.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { AttachmentComponent } from './attachment/attachment.component';
import { AttributesComponent } from './attributes/attributes.component';
import { ContactSelectComponent } from './contact-select/contact-select.component';

import { DialogFunctions } from '@app/core/dialog';

import { isEmpty, invert } from '@app/core/utils';
import { minStrict, max } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent extends DialogFunctions implements OnInit {
  @ViewChild(AttachmentComponent) attachments: AttachmentComponent;
  @ViewChild(AttributesComponent) attributes: AttributesComponent;
  @ViewChild('contactForPerson') contactForPerson: ContactSelectComponent;
  @ViewChild('contactForPhone') contactForPhone: ContactSelectComponent;

  dialog: 'confirm' | 'info';

  form = this.formBuilder.group({
    promise: this.formBuilder.group({
      date: null,
      amount: null,
      percentage: null,
    }),
    payment: this.formBuilder.group({
      date: null,
      amount: null,
      percentage: null,
      currencyId: null,
    }),
    nextCallDateTime: null,
    comment: '',
    autoComment: '',
    autoCommentId: null,
    phone: this.formBuilder.group({
      typeCode: null,
      phone: null,
      stopAutoSms: false,
      stopAutoInfo: false,
      comment: '',
    }),
    debtReasonCode: null,
    refusalReasonCode: null,
    callReasonCode: null,
    statusReasonCode: null,
  });

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private formBuilder: FormBuilder,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    // TODO(d.maltsev): check out async validators?
    // TODO(d.maltsev): unsubscribe
    combineLatest(
      this.contactRegistrationService.canSetInsufficientPromiseAmount$,
      this.contactRegistrationService.debt$.pipe(filter(Boolean)),
      this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    )
    .subscribe(([ canSet, debt, limit ]) => {
      this.form.get('promise.amount').setValidators([
        minStrict(canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
        max(debt.debtAmount),
      ]);
      this.form.get('promise.percentage').setValidators([
        minStrict(canSet ? 0 : limit.minAmountPercent),
        max(100),
      ]);
    });
  }

  get displayPromiseForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromise$;
  }

  get isPromiseAmountDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromiseAmount$.pipe(map(invert));
  }

  get displayPaymentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPayment$;
  }

  get isPaymentAmountDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPaymentAmount$.pipe(map(invert));
  }

  get displayNextCallDateForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetNextCallDate$;
  }

  get displayCommentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetComment$;
  }

  get displayAutoCommentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAutoCommentId$;
  }

  get displayPhoneForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPhone$;
  }

  get displayContactPersonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetContactPerson$;
  }

  get displayDebtReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetDebtReason$;
  }

  get displayRefusalForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetRefusal$;
  }

  get displayAttachmentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAttachment$;
  }

  get displayCallReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetCallReason$;
  }

  get displayChangeReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetChangeReason$;
  }

  get debtId$(): Observable<number> {
    return this.contactRegistrationService.debtId$;
  }

  get personId$(): Observable<number> {
    return this.contactRegistrationService.personId$;
  }

  get contactType$(): Observable<number> {
    return this.contactRegistrationService.contactType$;
  }

  get promiseMinDate(): Date {
    return moment().toDate();
  }

  get promiseMaxDate$(): Observable<Date> {
    return this.contactRegistrationService.limit$.pipe(
      map(limit => {
        const maxDays = limit && limit.maxDays;
        return maxDays == null ? null : moment().add(maxDays, 'day').toDate();
      }),
    );
  }

  get canSubmit(): boolean {
    return this.form.valid;
  }

  onPromiseAmountInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const amount = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(amount, 100.0 * amount / debt.debtAmount));
  }

  onPromisePercentageInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const percentage = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(debt.debtAmount * percentage / 100.0, percentage));
  }

  onSubmit(): void {
    combineLatest(
      this.contactRegistrationService.canSetInsufficientPromiseAmount$,
      this.contactRegistrationService.debt$,
      this.contactRegistrationService.limit$,
    )
    .pipe(first())
    .subscribe(([ canSet, debt, limit ]) => {
      if (this.form.value.promise.amount < limit.minAmountPercent * debt.debtAmount / 100) {
        this.setDialog(canSet ? 'confirm' : 'info');
        this.cdRef.markForCheck();
      } else {
        this.submit(false);
      }
    });
  }

  onConfirm(): void {
    this.submit(true);
  }

  onBack(): void {
    this.displayOutcomeTree();
  }

  private setPromiseAmount(amount: number, percentage: number): void {
    this.form.patchValue({ promise: { amount, percentage } });
    this.cdRef.markForCheck();
  }

  private displayOutcomeTree(): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
    this.cdRef.markForCheck();
  }

  private submit(isUnconfirmed: boolean = null): void {
    const { autoComment, ...data } = this.getFormGroupValueRecursively(this.form);
    if (this.attributes && !isEmpty(this.attributes.data)) {
      data.attributes = this.attributes.data;
    }
    if (this.contactForPerson && this.contactForPerson.person) {
      data.contactPerson = this.contactForPerson.person;
    }
    if (data.phone && this.contactForPhone && this.contactForPhone.person) {
      data.phone.person = this.contactForPhone.person;
    }
    if (data.payment) {
      delete data.payment.percentage;
    }
    if (data.promise) {
      data.promise.isUnconfirmed = isUnconfirmed;
      delete data.promise.percentage;
    }
    this.contactRegistrationService
      .completeRegistration(data)
      .subscribe(() => {
        this.displayOutcomeTree();
        this.contactRegistrationService.params = null;
      });
  }

  private getFormGroupValueRecursively(group: FormGroup): any {
    return Object.keys(group.controls).reduce((acc, key) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) {
        const value = this.getFormGroupValueRecursively(control);
        return Object.keys(value).length
          ? { ...acc, [key]: value }
          : acc;
      } else {
        return control.dirty
          ? { ...acc, [key]: this.convertValue(control.value) }
          : acc;
      }
    }, {});
  }

  private convertValue(value: any): string | number {
    switch (true) {
      case Array.isArray(value):
        return value[0].value;
      case value instanceof Date:
        return this.valueConverterService.toISO(value);
      default:
        return value;
    }
  }
}
