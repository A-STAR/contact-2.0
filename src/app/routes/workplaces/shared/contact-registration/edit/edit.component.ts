import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

import { IContactRegistrationMode } from '../contact-registration.interface';

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

  readonly displayContactPersonForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.changeContactPerson === 1),
  );

  readonly canDisplayContactForPhone$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.addPhone === 1),
  );

  readonly displayAttributeTree$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => Boolean(outcome && outcome.attributes && outcome.attributes.length)),
  );

  readonly displayAttachmentForm$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && [2, 3].includes(outcome.fileAttachMode)),
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
    this.displayOutcomeTree();
  }

  private submit(isUnconfirmed: boolean = null): void {
    const { autoComment, ...data } = this.getFormGroupValueRecursively(this.form);
    if (this.isAttributeTreeValid()) {
      data.attributes = this.attributes && this.attributes.data;
    }
    if (this.isContactForPersonHasChosen()) {
      data.contactPerson = this.contactForPerson && this.contactForPerson.person;
    }
    if (data.phone && this.isContactForPhoneHasChosen()) {
      data.phone.person = this.contactForPhone && this.contactForPhone.person;
    }
    if (data.payment) {
      delete data.payment.percentage;
    }
    if (data.promise) {
      data.promise.isUnconfirmed = Number(isUnconfirmed);
      delete data.promise.percentage;
    }
    this.contactRegistrationService
      .completeRegistration(data)
      .subscribe(() => {
        this.contactRegistrationService.cancelRegistration();
        this.form.reset();
      });
  }

  private isEntityHasChosen(): boolean {
    return this.isAttributeTreeValid() && this.isContactValid();
  }

  private isAttributeTreeValid(): boolean {
    return !this.attributes || this.attributes.isValid;
  }

  private isContactForPersonHasChosen(): boolean {
    return !this.contactForPerson || !!this.contactForPerson.person;
  }

  private isContactForPhoneHasChosen(): boolean {
    return !this.contactForPhone || !!this.contactForPhone.person;
  }

  private isContactValid(): boolean {
    return this.isContactForPersonHasChosen() && this.isContactForPhoneHasChosen();
  }

  private displayOutcomeTree(): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
    this.cdRef.markForCheck();
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
