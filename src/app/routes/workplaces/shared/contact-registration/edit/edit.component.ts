import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IContactRegistrationMode } from '../contact-registration.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { ContactRegistrationAttachmentsComponent } from './attachment/attachment.component';
import { ContactRegistrationAttributesComponent } from './attributes/attributes.component';
import { ContactRegistrationPhoneComponent } from './phone/phone.component';
import { ContactSelectComponent } from './contact-select/contact-select.component';

import { DialogFunctions } from '@app/core/dialog';

import { isEmpty } from '@app/core/utils';

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

  get displayContactPersonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetContactPerson$;
  }

  get displayAttachmentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAttachment$;
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

  get canSubmit(): boolean {
    return this.form.valid;
  }

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
      data.promise.isUnconfirmed = Number(isUnconfirmed);
      delete data.promise.percentage;
    }
    this.contactRegistrationService
      .completeRegistration(data)
      .subscribe(() => {
        this.displayOutcomeTree();
        this.contactRegistrationService.params = null;
      });
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
