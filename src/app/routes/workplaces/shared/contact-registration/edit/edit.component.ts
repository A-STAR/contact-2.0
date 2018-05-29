import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

import { ContactRegistrationService } from '../contact-registration.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { ContactRegistrationAttachmentsComponent } from './attachment/attachment.component';
import { ContactRegistrationAttributesComponent } from './attributes/attributes.component';
import { ContactRegistrationPhoneComponent } from './phone/phone.component';
import { ContactSelectComponent } from './contact-select/contact-select.component';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent extends DialogFunctions {
  @ViewChild(ContactRegistrationAttachmentsComponent) attachments: ContactRegistrationAttachmentsComponent;
  @ViewChild(ContactRegistrationAttributesComponent) attributes: ContactRegistrationAttributesComponent;
  @ViewChild(ContactRegistrationPhoneComponent) contactForPhone: ContactRegistrationPhoneComponent;
  @ViewChild(ContactSelectComponent) contactForPerson: ContactSelectComponent;

  private isPaymentChanged = false;
  private isPromiseChanged = false;
  private isContactChanged = false;

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

  // Forms display

  readonly displayContactPersonForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.changeContactPerson === 1),
  );

  readonly displayContactForPhone$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.addPhone === 1),
  );

  readonly displayAttributeTree$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => Boolean(outcome && outcome.attributes && outcome.attributes.length)),
  );

  readonly displayAttachmentForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.fileAttachMode)),
  );

  readonly displayPromiseForm$ = this.contactRegistrationService.canSetPromise$;

  readonly displayPaymentForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.paymentMode)),
  );

  readonly displayNextCallForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.nextCallMode)),
  );

  readonly displayCommentForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.commentMode)),
  );

  readonly displayAutoCommentForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && Boolean(outcome.autoCommentIds)),
  );

  readonly displayDebtReasonForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.debtReasonMode))
);

  readonly displayRefusalForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.isRefusal === 1),
  );

  readonly displayCallReasonForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.callReasonMode))
  );

  readonly displayStatusChangeForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.statusReasonMode) && Boolean(outcome.debtStatusCode)),
  );

  readonly displayPrompt$ = combineLatest(
    this.displayContactPersonForm$,
    this.displayContactForPhone$,
    this.displayAttributeTree$,
    this.displayAttachmentForm$,
    this.displayPromiseForm$,
    this.displayPaymentForm$,
    this.displayNextCallForm$,
    this.displayCommentForm$,
    this.displayAutoCommentForm$,
    this.displayDebtReasonForm$,
    this.displayRefusalForm$,
    this.displayCallReasonForm$,
    this.displayStatusChangeForm$,
  ).pipe(
    map(formsDisplay => !formsDisplay.some(Boolean))
  );

  readonly debtId$ = this.contactRegistrationService.debtId$;

  readonly personId$ = this.contactRegistrationService.personId$;

  readonly contactType$ = this.contactRegistrationService.contactType$;

  get canSubmit(): boolean {
    return this.form.valid && this.isEntityHasChosen();
  }

  readonly minAmountPercentMessageParams$ = this.contactRegistrationService.limit$.pipe(
      map(limit => ({ percent: limit && limit.minAmountPercent })),
  );

  onSubmit(): void {
    combineLatest(
      this.contactRegistrationService.canSetInsufficientPromiseAmount$,
      this.contactRegistrationService.debt$,
      this.contactRegistrationService.limit$,
    )
    .pipe(first())
    .subscribe(([ canSet, debt, limit ]) => {
      const { amount } = this.form.value.promise;
      if (amount && limit && amount < limit.minAmountPercent * debt.debtAmount / 100) {
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
    this.contactRegistrationService.toOutcomeTree();
    this.form.reset();
    // this.displayOutcomeTree();
  }

  private submit(isUnconfirmed: boolean = null): void {
    const { autoComment, ...data } = this.getFormGroupValueRecursively(this.form);
    this.contactRegistrationService
      .completeRegistration(this.getSubmitData(data, isUnconfirmed))
      .subscribe(() => {
        // NOTE: emit changes before cancelling registration
        this.onCompleteRegistration();
        this.contactRegistrationService.cancelRegistration();
        this.form.reset();
      });
  }

  private getSubmitData(data: any, isUnconfirmed: boolean): any {
    const result = {...data };
    if (this.isAttributeTreeValid()) {
      result.attributes = this.attributes && this.attributes.data;
    }
    if (this.isContactForPersonHasChosen()) {
      result.contactPerson = this.contactForPerson && this.contactForPerson.person;
      this.isContactChanged = !!result.contactPerson;
    }
    if (result.phone && this.isContactForPhoneHasChosen()) {
      result.phone.person = this.contactForPhone && this.contactForPhone.person;
      this.isContactChanged = !!result.phone.person;
    }
    if (result.payment) {
      delete result.payment.percentage;
      this.isPaymentChanged = true;
    }
    if (result.promise) {
      result.promise.isUnconfirmed = Number(isUnconfirmed);
      delete result.promise.percentage;
      this.isPromiseChanged = true;
    }
    return result;
  }

  private isEntityHasChosen(): boolean {
    return this.isAttributeTreeValid() && this.isContactValid() && this.attachmentsValid();
  }

  private attachmentsValid(): boolean {
    return !this.attachments || this.attachments.isValid;
  }

  private isAttributeTreeValid(): boolean {
    return !this.attributes || this.attributes.isValid;
  }

  private isContactForPersonHasChosen(): boolean {
    return !this.contactForPerson || !!this.contactForPerson.isValid;
  }

  private isContactForPhoneHasChosen(): boolean {
    return !this.contactForPhone || !!this.contactForPhone.isValid;
  }

  private isContactValid(): boolean {
    return this.isContactForPersonHasChosen() && this.isContactForPhoneHasChosen();
  }

  // private displayOutcomeTree(): void {
  //   this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
  //   this.cdRef.markForCheck();
  // }

  private onCompleteRegistration(): void {
    this.contactRegistrationService.contactPersonChange$.next(this.isContactChanged);
    this.contactRegistrationService.paymentChange$.next(this.isPaymentChanged);
    this.contactRegistrationService.promiseChange$.next(this.isPromiseChanged);
    this.contactRegistrationService.completeRegistration$.next(true);
    this.contactRegistrationService.attachmentChange$.next(true);
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
      case value instanceof Boolean:
        return Number(value);
      default:
        return value;
    }
  }
}
