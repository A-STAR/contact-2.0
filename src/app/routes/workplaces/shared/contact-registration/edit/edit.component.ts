import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationMode } from '../contact-registration.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { AttachmentComponent } from './attachment/attachment.component';
import { AttributesComponent } from './attributes/attributes.component';
import { ContactSelectComponent } from './contact-select/contact-select.component';

import { isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  @ViewChild(AttachmentComponent) attachments: AttachmentComponent;
  @ViewChild(AttributesComponent) attributes: AttributesComponent;
  @ViewChild('contactForPerson') contactForPerson: ContactSelectComponent;
  @ViewChild('contactForPhone') contactForPhone: ContactSelectComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private formBuilder: FormBuilder,
    private valueConverterService: ValueConverterService,
  ) {}

  form = this.formBuilder.group({
    promise: this.formBuilder.group({
      date: null,
      amount: null,
    }),
    payment: this.formBuilder.group({
      date: null,
      amount: null,
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

  get displayPromiseForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromise$;
  }

  get displayPaymentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPayment$;
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

  get canSubmit(): boolean {
    return this.form.valid;
  }

  onSubmit(): void {
    const { autoComment, ...data } = this.formValue;
    if (this.attributes && !isEmpty(this.attributes.data)) {
      data.attributes = this.attributes.data;
    }
    if (this.contactForPerson && this.contactForPerson.person) {
      data.contactPerson = this.contactForPerson.person;
    }
    if (data.phone && this.contactForPhone && this.contactForPhone.person) {
      data.phone.person = this.contactForPhone.person;
    }
    this.contactRegistrationService
      .completeRegistration(data)
      .subscribe(() => {
        this.displayOutcomeTree();
        this.contactRegistrationService.params = null;
      });
  }

  onBack(): void {
    this.displayOutcomeTree();
  }

  private displayOutcomeTree(): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
    this.cdRef.markForCheck();
  }

  private get formValue(): any {
    return this.getFormGroupValueRecursively(this.form);
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
